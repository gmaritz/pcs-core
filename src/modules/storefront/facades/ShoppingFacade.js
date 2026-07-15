"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoppingFacade = exports.ShoppingFacade = void 0;
const client_1 = require("@prisma/client");
const services_1 = require("../../commerce/services");
const content_1 = require("../../content");
const services_2 = require("../../customers/services");
const media_1 = require("../../media");
const notification_1 = require("../../notification");
const services_3 = require("../../catalog/services");
const services_4 = require("../../orders/services");
const checkout_1 = require("../../workflows/checkout");
const order_processing_1 = require("../../workflows/order-processing");
const IN_PROGRESS_ORDER_STATUSES = new Set([
    client_1.OrderStatus.PENDING,
    client_1.OrderStatus.CONFIRMED,
    client_1.OrderStatus.PROCESSING,
    client_1.OrderStatus.SHIPPED,
]);
class ShoppingFacade {
    async buildCartPageViewModel(input) {
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
            metadata: content_1.pageMetadataService.buildCartPageMetadata(),
            notification: this.toNotificationViewModel(input.notificationEvent),
            page: cartModel,
        };
    }
    async addToCart(input) {
        const quantity = Number.isFinite(input.quantity) && input.quantity > 0
            ? Math.floor(input.quantity)
            : 1;
        const variant = await services_3.productVariantService.getProductVariants({
            where: {
                id: input.productVariantId,
                status: client_1.RecordStatus.ACTIVE,
                product: {
                    status: client_1.RecordStatus.ACTIVE,
                },
            },
            take: 1,
        });
        if (!variant[0]) {
            throw new Error('Product variant not available.');
        }
        const cart = await this.ensureActiveCart(input.customerId);
        const existingItems = await services_1.cartItemService.getCartItems({
            where: {
                cartId: cart.id,
                productVariantId: input.productVariantId,
            },
            take: 1,
        });
        const existingItem = existingItems[0];
        if (existingItem) {
            await services_1.cartItemService.updateCartItem(existingItem.id, {
                quantity: existingItem.quantity + quantity,
            });
            return;
        }
        await services_1.cartItemService.createCartItem({
            cartId: cart.id,
            productVariantId: input.productVariantId,
            quantity,
        });
    }
    async updateCartItemQuantity(input) {
        const item = await this.requireOwnedCartItem(input.customerId, input.cartItemId);
        const quantity = Number.isFinite(input.quantity) && input.quantity > 0
            ? Math.floor(input.quantity)
            : 1;
        await services_1.cartItemService.updateCartItem(item.id, {
            quantity,
        });
    }
    async removeCartItem(input) {
        const item = await this.requireOwnedCartItem(input.customerId, input.cartItemId);
        await services_1.cartItemService.deleteCartItem(item.id);
    }
    async buildCheckoutPageViewModel(input) {
        const customer = await this.requireCustomer(input.customerId);
        const cart = await this.ensureActiveCart(input.customerId);
        const addressBook = await services_2.addressService.getAddresses({
            where: {
                customerId: input.customerId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        const summary = this.mapCheckoutItems(cart);
        const total = summary.reduce((sum, item) => sum + item.lineTotalAmount, 0);
        const model = {
            customerId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerEmail: customer.email,
            cartId: cart.id,
            addressBook: addressBook.map((address) => ({
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
            metadata: content_1.pageMetadataService.buildCheckoutPageMetadata(),
            notification: this.toNotificationViewModel(input.notificationEvent),
            page: model,
        };
    }
    async placeOrder(input) {
        await this.requireCustomer(input.customerId);
        const cart = await this.ensureActiveCart(input.customerId);
        const checkoutResult = await checkout_1.checkoutService.checkout({
            cartId: cart.id,
            billingAddressId: input.billingAddressId,
            shippingAddressId: input.shippingAddressId,
            notes: input.notes,
        });
        await order_processing_1.orderProcessingService.processOrder({
            orderId: checkoutResult.order.id,
        });
        return {
            orderId: checkoutResult.order.id,
        };
    }
    async buildOrderConfirmationPageViewModel(input) {
        const orders = await services_4.orderService.getOrders({
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
        });
        const order = orders[0];
        if (!order) {
            return null;
        }
        const items = this.mapOrderConfirmationItems(order);
        const total = items.reduce((sum, item) => sum + item.lineTotalAmount, 0);
        const model = {
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
            metadata: content_1.pageMetadataService.buildOrderConfirmationPageMetadata(order.id, order.orderNumber),
            notification: this.toNotificationViewModel(input.notificationEvent),
            page: model,
        };
    }
    async buildCustomerAccountPageViewModel(input) {
        const customer = await this.requireCustomer(input.customerId);
        const orders = await services_4.orderService.getOrders({
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
        });
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
        const model = {
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
            metadata: content_1.pageMetadataService.buildCustomerAccountPageMetadata(),
            notification: this.toNotificationViewModel(input.notificationEvent),
            page: model,
        };
    }
    async requireCustomer(customerId) {
        const customer = await services_2.customerService.getCustomer(customerId);
        if (!customer || customer.status !== client_1.RecordStatus.ACTIVE) {
            throw new Error('Customer not found.');
        }
        return customer;
    }
    async ensureActiveCart(customerId) {
        const carts = await services_1.cartService.getCarts({
            where: {
                customerId,
                status: client_1.CartStatus.ACTIVE,
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
        });
        if (carts[0]) {
            return carts[0];
        }
        const createdCart = await services_1.cartService.createCart({
            customerId,
        });
        const createdCarts = await services_1.cartService.getCarts({
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
        });
        if (!createdCarts[0]) {
            throw new Error('Unable to initialize cart.');
        }
        return createdCarts[0];
    }
    async mapCartViewModel(cart, customerId) {
        const productIds = Array.from(new Set(cart.items.map((item) => item.productVariant.productId)));
        const imageMap = await media_1.mediaService.resolveProductImages(productIds);
        const items = cart.items.map((item) => {
            const unitPriceAmount = Number(item.productVariant.sellingPrice ?? 0);
            const lineTotalAmount = unitPriceAmount * item.quantity;
            const media = imageMap[item.productVariant.productId];
            const availableQuantity = item.productVariant.inventory.reduce((sum, inventory) => (sum + (inventory.quantityOnHand - inventory.quantityReserved)), 0);
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
    mapCheckoutItems(cart) {
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
    mapOrderConfirmationItems(order) {
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
    async requireOwnedCartItem(customerId, cartItemId) {
        const items = await services_1.cartItemService.getCartItems({
            where: {
                id: cartItemId,
                cart: {
                    customerId,
                    status: client_1.CartStatus.ACTIVE,
                },
            },
            take: 1,
        });
        if (!items[0]) {
            throw new Error('Cart item not found.');
        }
        return items[0];
    }
    toNotificationViewModel(event) {
        if (!event) {
            return undefined;
        }
        const result = notification_1.notificationService.create(event);
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
    formatAddressLabel(type) {
        return type === 'SHIPPING'
            ? 'Shipping Address'
            : 'Billing Address';
    }
    formatOrderStatus(status) {
        return status
            .toLowerCase()
            .split('_')
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join(' ');
    }
    formatCurrency(amount) {
        return `R${new Intl.NumberFormat('en-ZA').format(amount)}`;
    }
    formatDate(date) {
        return new Intl.DateTimeFormat('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(date);
    }
}
exports.ShoppingFacade = ShoppingFacade;
exports.shoppingFacade = new ShoppingFacade();
