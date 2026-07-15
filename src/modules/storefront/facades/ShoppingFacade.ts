import {
  CartStatus,
  OrderStatus,
  Prisma,
  RecordStatus,
} from '@prisma/client';

import {
  cartItemService,
  cartService,
} from '../../commerce/services';
import {
  PageMetadata,
  pageMetadataService,
} from '../../content';
import {
  addressService,
  customerService,
} from '../../customers/services';
import {
  mediaService,
} from '../../media';
import {
  NotificationEvent,
  notificationService,
} from '../../notification';
import {
  productVariantService,
} from '../../catalog/services';
import {
  orderService,
} from '../../orders/services';
import {
  checkoutService,
} from '../../workflows/checkout';
import {
  orderProcessingService,
} from '../../workflows/order-processing';

import {
  CartItemViewModel,
  CartViewModel,
  CheckoutAddressViewModel,
  CheckoutSummaryItemViewModel,
  CheckoutViewModel,
  CustomerAccountViewModel,
  NotificationViewModel,
  OrderConfirmationItemViewModel,
  OrderConfirmationViewModel,
  ShoppingPageViewModel,
} from '../view-models';

const IN_PROGRESS_ORDER_STATUSES = new Set<OrderStatus>([
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
]);

type CartRecord = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        productVariant: {
          include: {
            product: true;
            inventory: true;
          };
        };
      };
    };
  };
}>;

type OrderRecord = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    items: {
      include: {
        productVariant: {
          include: {
            product: true;
          };
        };
      };
    };
  };
}>;

type AccountOrderRecord = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        productVariant: true;
      };
    };
  };
}>;

export class ShoppingFacade {
  async buildCartPageViewModel(input: {
    customerId: string;
    notificationEvent?: NotificationEvent;
  }): Promise<ShoppingPageViewModel<CartViewModel>> {
    const customer = await this.requireCustomer(input.customerId);
    const cart = await this.ensureActiveCart(input.customerId);
    const cartModel = await this.mapCartViewModel(cart, input.customerId);

    return {
      heading: 'Your Cart',
      description: 'Review your selected products and continue to checkout.',
      breadcrumbs: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Cart',
        },
      ],
      metadata: pageMetadataService.buildCartPageMetadata(),
      notification: this.toNotificationViewModel(input.notificationEvent),
      page: cartModel,
    };
  }

  async addToCart(input: {
    customerId: string;
    productVariantId: string;
    quantity: number;
  }): Promise<void> {
    const quantity = Number.isFinite(input.quantity) && input.quantity > 0
      ? Math.floor(input.quantity)
      : 1;

    const variant = await productVariantService.getProductVariants({
      where: {
        id: input.productVariantId,
        status: RecordStatus.ACTIVE,
        product: {
          status: RecordStatus.ACTIVE,
        },
      },
      take: 1,
    });

    if (!variant[0]) {
      throw new Error('Product variant not available.');
    }

    const cart = await this.ensureActiveCart(input.customerId);

    const existingItems = await cartItemService.getCartItems({
      where: {
        cartId: cart.id,
        productVariantId: input.productVariantId,
      },
      take: 1,
    });

    const existingItem = existingItems[0];

    if (existingItem) {
      await cartItemService.updateCartItem(existingItem.id, {
        quantity: existingItem.quantity + quantity,
      });
      return;
    }

    await cartItemService.createCartItem({
      cartId: cart.id,
      productVariantId: input.productVariantId,
      quantity,
    });
  }

  async updateCartItemQuantity(input: {
    customerId: string;
    cartItemId: string;
    quantity: number;
  }): Promise<void> {
    const item = await this.requireOwnedCartItem(input.customerId, input.cartItemId);

    const quantity = Number.isFinite(input.quantity) && input.quantity > 0
      ? Math.floor(input.quantity)
      : 1;

    await cartItemService.updateCartItem(item.id, {
      quantity,
    });
  }

  async removeCartItem(input: {
    customerId: string;
    cartItemId: string;
  }): Promise<void> {
    const item = await this.requireOwnedCartItem(input.customerId, input.cartItemId);

    await cartItemService.deleteCartItem(item.id);
  }

  async buildCheckoutPageViewModel(input: {
    customerId: string;
    notificationEvent?: NotificationEvent;
  }): Promise<ShoppingPageViewModel<CheckoutViewModel>> {
    const customer = await this.requireCustomer(input.customerId);
    const cart = await this.ensureActiveCart(input.customerId);
    const addressBook = await addressService.getAddresses({
      where: {
        customerId: input.customerId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const summary = this.mapCheckoutItems(cart);
    const total = summary.reduce((sum, item) => sum + item.lineTotalAmount, 0);

    const model: CheckoutViewModel = {
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      cartId: cart.id,
      addressBook: addressBook.map((address): CheckoutAddressViewModel => ({
        id: address.id,
        label: this.formatAddressLabel(address.type),
        line1: address.line1,
        line2: address.line2 ?? undefined,
        suburb: address.suburb ?? undefined,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        country: address.country,
      })),
      billingAddressId: addressBook[0]?.id,
      shippingAddressId: addressBook[0]?.id,
      orderSummary: summary.map((item) => item.view),
      orderTotal: this.formatCurrency(total),
      placeOrderActionUrl: '/checkout/place-order',
      returnToCartUrl: `/cart?customerId=${encodeURIComponent(input.customerId)}`,
    };

    return {
      heading: 'Checkout',
      description: 'Confirm your customer and delivery details before placing your order.',
      breadcrumbs: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Cart',
          href: `/cart?customerId=${encodeURIComponent(input.customerId)}`,
        },
        {
          label: 'Checkout',
        },
      ],
      metadata: pageMetadataService.buildCheckoutPageMetadata(),
      notification: this.toNotificationViewModel(input.notificationEvent),
      page: model,
    };
  }

  async placeOrder(input: {
    customerId: string;
    billingAddressId?: string;
    shippingAddressId?: string;
    notes?: string;
  }): Promise<{ orderId: string }> {
    await this.requireCustomer(input.customerId);
    const cart = await this.ensureActiveCart(input.customerId);

    const checkoutResult = await checkoutService.checkout({
      cartId: cart.id,
      billingAddressId: input.billingAddressId,
      shippingAddressId: input.shippingAddressId,
      notes: input.notes,
    });

    await orderProcessingService.processOrder({
      orderId: checkoutResult.order.id,
    });

    return {
      orderId: checkoutResult.order.id,
    };
  }

  async buildOrderConfirmationPageViewModel(input: {
    customerId: string;
    orderId: string;
    notificationEvent?: NotificationEvent;
  }): Promise<ShoppingPageViewModel<OrderConfirmationViewModel> | null> {
    const orders = await orderService.getOrders({
      where: {
        id: input.orderId,
        customerId: input.customerId,
      },
      include: {
        customer: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      take: 1,
    }) as OrderRecord[];

    const order = orders[0];

    if (!order) {
      return null;
    }

    const items = this.mapOrderConfirmationItems(order);
    const total = items.reduce((sum, item) => sum + item.lineTotalAmount, 0);

    const model: OrderConfirmationViewModel = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: this.formatDate(order.createdAt),
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      status: this.formatOrderStatus(order.status),
      items: items.map((item) => item.view),
      orderTotal: this.formatCurrency(total),
      continueShoppingUrl: `/shop`,
    };

    return {
      heading: 'Order Confirmation',
      description: 'Your order has been placed and is now being prepared.',
      breadcrumbs: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Order Confirmation',
        },
      ],
      metadata: pageMetadataService.buildOrderConfirmationPageMetadata(
        order.id,
        order.orderNumber,
      ),
      notification: this.toNotificationViewModel(input.notificationEvent),
      page: model,
    };
  }

  async buildCustomerAccountPageViewModel(input: {
    customerId: string;
    notificationEvent?: NotificationEvent;
  }): Promise<ShoppingPageViewModel<CustomerAccountViewModel>> {
    const customer = await this.requireCustomer(input.customerId);

    const orders = await orderService.getOrders({
      where: {
        customerId: input.customerId,
      },
      include: {
        items: {
          include: {
            productVariant: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as AccountOrderRecord[];

    const mapped = orders.map((order) => {
      const orderTotalAmount = order.items.reduce((sum, item) => {
        const unitPrice = Number(item.productVariant.sellingPrice ?? 0);
        return sum + (unitPrice * item.quantity);
      }, 0);

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderDate: this.formatDate(order.createdAt),
        status: this.formatOrderStatus(order.status),
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        orderTotal: this.formatCurrency(orderTotalAmount),
        confirmationUrl: `/order-confirmation/${order.id}?customerId=${encodeURIComponent(input.customerId)}`,
        statusRaw: order.status,
      };
    });

    const currentOrders = mapped
      .filter((item) => IN_PROGRESS_ORDER_STATUSES.has(item.statusRaw))
      .map(({ statusRaw: _statusRaw, ...item }) => item);

    const previousOrders = mapped
      .filter((item) => !IN_PROGRESS_ORDER_STATUSES.has(item.statusRaw))
      .map(({ statusRaw: _statusRaw, ...item }) => item);

    const model: CustomerAccountViewModel = {
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerTelephone: customer.telephone ?? undefined,
      currentOrders,
      previousOrders,
    };

    return {
      heading: 'My Account',
      description: 'View your profile details and order history.',
      breadcrumbs: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'My Account',
        },
      ],
      metadata: pageMetadataService.buildCustomerAccountPageMetadata(),
      notification: this.toNotificationViewModel(input.notificationEvent),
      page: model,
    };
  }

  private async requireCustomer(
    customerId: string,
  ) {
    const customer = await customerService.getCustomer(customerId);

    if (!customer || customer.status !== RecordStatus.ACTIVE) {
      throw new Error('Customer not found.');
    }

    return customer;
  }

  private async ensureActiveCart(
    customerId: string,
  ): Promise<CartRecord> {
    const carts = await cartService.getCarts({
      where: {
        customerId,
        status: CartStatus.ACTIVE,
      },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
                inventory: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    }) as CartRecord[];

    if (carts[0]) {
      return carts[0];
    }

    const createdCart = await cartService.createCart({
      customerId,
    });

    const createdCarts = await cartService.getCarts({
      where: {
        id: createdCart.id,
      },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
                inventory: true,
              },
            },
          },
        },
      },
      take: 1,
    }) as CartRecord[];

    if (!createdCarts[0]) {
      throw new Error('Unable to initialize cart.');
    }

    return createdCarts[0];
  }

  private async mapCartViewModel(
    cart: CartRecord,
    customerId: string,
  ): Promise<CartViewModel> {
    const productIds = Array.from(new Set(cart.items.map((item) => item.productVariant.productId)));
    const imageMap = await mediaService.resolveProductImages(productIds);

    const items: CartItemViewModel[] = cart.items.map((item) => {
      const unitPriceAmount = Number(item.productVariant.sellingPrice ?? 0);
      const lineTotalAmount = unitPriceAmount * item.quantity;
      const media = imageMap[item.productVariant.productId];
      const availableQuantity = item.productVariant.inventory.reduce((sum, inventory) => (
        sum + (inventory.quantityOnHand - inventory.quantityReserved)
      ), 0);
      const isAvailable = availableQuantity > 0;

      return {
        cartItemId: item.id,
        productName: item.productVariant.product.name,
        productSlug: item.productVariant.product.slug,
        variantName: item.productVariant.name,
        sku: item.productVariant.sku,
        quantity: item.quantity,
        unitPrice: this.formatCurrency(unitPriceAmount),
        lineTotal: this.formatCurrency(lineTotalAmount),
        imageUrl: media.url,
        imageAlt: media.altText,
        availabilityLabel: isAvailable ? 'In Stock' : 'Out of Stock',
        isAvailable,
      };
    });

    const cartTotalAmount = cart.items.reduce((sum, item) => {
      const unitPriceAmount = Number(item.productVariant.sellingPrice ?? 0);
      return sum + (unitPriceAmount * item.quantity);
    }, 0);

    return {
      customerId,
      cartId: cart.id,
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: this.formatCurrency(cartTotalAmount),
      checkoutUrl: `/checkout?customerId=${encodeURIComponent(customerId)}`,
      continueShoppingUrl: '/shop',
    };
  }

  private mapCheckoutItems(
    cart: CartRecord,
  ): Array<{
    lineTotalAmount: number;
    view: CheckoutSummaryItemViewModel;
  }> {
    return cart.items.map((item) => {
      const unitPriceAmount = Number(item.productVariant.sellingPrice ?? 0);
      const lineTotalAmount = unitPriceAmount * item.quantity;

      return {
        lineTotalAmount,
        view: {
          productName: item.productVariant.product.name,
          sku: item.productVariant.sku,
          quantity: item.quantity,
          unitPrice: this.formatCurrency(unitPriceAmount),
          lineTotal: this.formatCurrency(lineTotalAmount),
        },
      };
    });
  }

  private mapOrderConfirmationItems(
    order: OrderRecord,
  ): Array<{
    lineTotalAmount: number;
    view: OrderConfirmationItemViewModel;
  }> {
    return order.items.map((item) => {
      const unitPriceAmount = Number(item.productVariant.sellingPrice ?? 0);
      const lineTotalAmount = unitPriceAmount * item.quantity;

      return {
        lineTotalAmount,
        view: {
          productName: item.productVariant.product.name,
          sku: item.productVariant.sku,
          quantity: item.quantity,
          unitPrice: this.formatCurrency(unitPriceAmount),
          lineTotal: this.formatCurrency(lineTotalAmount),
        },
      };
    });
  }

  private async requireOwnedCartItem(
    customerId: string,
    cartItemId: string,
  ) {
    const items = await cartItemService.getCartItems({
      where: {
        id: cartItemId,
        cart: {
          customerId,
          status: CartStatus.ACTIVE,
        },
      },
      take: 1,
    });

    if (!items[0]) {
      throw new Error('Cart item not found.');
    }

    return items[0];
  }

  private toNotificationViewModel(
    event?: NotificationEvent,
  ): NotificationViewModel | undefined {
    if (!event) {
      return undefined;
    }

    const result = notificationService.create(event);
    const notification = result.notifications[0];

    if (!notification) {
      return undefined;
    }

    return {
      title: notification.title,
      message: notification.message,
      severity: notification.severity,
    };
  }

  private formatAddressLabel(
    type: 'SHIPPING' | 'BILLING',
  ): string {
    return type === 'SHIPPING'
      ? 'Shipping Address'
      : 'Billing Address';
  }

  private formatOrderStatus(
    status: OrderStatus,
  ): string {
    return status
      .toLowerCase()
      .split('_')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }

  private formatCurrency(
    amount: number,
  ): string {
    return `R${new Intl.NumberFormat('en-ZA').format(amount)}`;
  }

  private formatDate(
    date: Date,
  ): string {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  }
}

export const shoppingFacade =
  new ShoppingFacade();
