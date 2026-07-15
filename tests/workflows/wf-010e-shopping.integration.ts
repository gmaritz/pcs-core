import {
  OrderStatus,
  RecordStatus,
} from '@prisma/client';

import {
  prisma,
} from '../../src/infrastructure/database';
import {
  notificationService,
} from '../../src/modules/notification';
import {
  ShoppingController,
} from '../../src/modules/storefront/controllers';
import {
  ShoppingFacade,
} from '../../src/modules/storefront/facades';

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(message);
  }
}

type Fixture = {
  customer: {
    id: string;
    email: string;
  };
  addressId: string;
  variantId: string;
  inventoryId: string;
};

async function createFixture(
  runTag: string,
): Promise<Fixture> {
  const sport = await prisma.sport.create({
    data: {
      name: `WF010E Sport ${runTag}`,
      code: `WF010E-SP-${runTag}`,
      slug: `wf010e-sp-${runTag}`,
      status: RecordStatus.ACTIVE,
    },
  });

  const category = await prisma.category.create({
    data: {
      name: `WF010E Category ${runTag}`,
      code: `WF010E-CAT-${runTag}`,
      slug: `wf010e-cat-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const brand = await prisma.brand.create({
    data: {
      name: `WF010E Brand ${runTag}`,
      code: `WF010E-BR-${runTag}`,
      slug: `wf010e-br-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const product = await prisma.product.create({
    data: {
      name: `WF010E Product ${runTag}`,
      code: `WF010E-PR-${runTag}`,
      slug: `wf010e-pr-${runTag}`,
      shortDescription: 'WF-010E test product',
      sportId: sport.id,
      categoryId: category.id,
      brandId: brand.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const variant = await prisma.productVariant.create({
    data: {
      name: `WF010E Variant ${runTag}`,
      sku: `WF010E-SKU-${runTag}`,
      slug: `wf010e-sku-${runTag}`,
      productId: product.id,
      sellingPrice: 2199,
      isDefault: true,
      status: RecordStatus.ACTIVE,
    },
  });

  const inventory = await prisma.inventory.create({
    data: {
      productVariantId: variant.id,
      quantityOnHand: 10,
      quantityReserved: 0,
    },
  });

  const customer = await prisma.customer.create({
    data: {
      firstName: 'WF010E',
      lastName: `Customer ${runTag}`,
      email: `wf010e+${runTag}@example.com`,
      status: RecordStatus.ACTIVE,
    },
  });

  const address = await prisma.address.create({
    data: {
      type: 'SHIPPING',
      line1: '123 Test Street',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      country: 'South Africa',
      customerId: customer.id,
    },
  });

  return {
    customer: {
      id: customer.id,
      email: customer.email,
    },
    addressId: address.id,
    variantId: variant.id,
    inventoryId: inventory.id,
  };
}

async function cleanup(
  runTag: string,
): Promise<void> {
  await prisma.inventoryMovement.deleteMany({
    where: {
      reference: {
        contains: 'ORDER:',
      },
      inventory: {
        productVariant: {
          sku: {
            endsWith: `-${runTag}`,
          },
        },
      },
    },
  });

  await prisma.payment.deleteMany({
    where: {
      order: {
        orderNumber: {
          contains: 'ORD-',
        },
        customer: {
          email: `wf010e+${runTag}@example.com`,
        },
      },
    },
  });

  await prisma.orderItem.deleteMany({
    where: {
      order: {
        customer: {
          email: `wf010e+${runTag}@example.com`,
        },
      },
    },
  });

  await prisma.order.deleteMany({
    where: {
      customer: {
        email: `wf010e+${runTag}@example.com`,
      },
    },
  });

  await prisma.cartItem.deleteMany({
    where: {
      cart: {
        customer: {
          email: `wf010e+${runTag}@example.com`,
        },
      },
    },
  });

  await prisma.cart.deleteMany({
    where: {
      customer: {
        email: `wf010e+${runTag}@example.com`,
      },
    },
  });

  await prisma.address.deleteMany({
    where: {
      customer: {
        email: `wf010e+${runTag}@example.com`,
      },
    },
  });

  await prisma.inventory.deleteMany({
    where: {
      productVariant: {
        sku: {
          endsWith: `-${runTag}`,
        },
      },
    },
  });

  await prisma.productVariant.deleteMany({
    where: {
      sku: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.product.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.brand.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.category.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.sport.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.customer.deleteMany({
    where: {
      email: `wf010e+${runTag}@example.com`,
    },
  });
}

function createMockResponse() {
  const locals: Record<string, unknown> = {};

  return {
    locals,
    render: (view: string, payload: Record<string, unknown>) => {
      locals.view = view;
      locals.payload = payload;
    },
    redirect: (url: string) => {
      locals.redirectUrl = url;
    },
    status: (code: number) => {
      locals.statusCode = code;
      return {
        render: (view: string, payload: Record<string, unknown>) => {
          locals.view = view;
          locals.payload = payload;
        },
      };
    },
  };
}

async function run(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run WF-010E integration checks.');
  }

  const runTag = Date.now().toString();
  const facade = new ShoppingFacade();

  try {
    console.log('WF-010E Integration: setup');
    const fixture = await createFixture(runTag);

    console.log('WF-010E Integration: test 1 add product updates cart and generates notification');
    await facade.addToCart({
      customerId: fixture.customer.id,
      productVariantId: fixture.variantId,
      quantity: 2,
    });

    const cartPage = await facade.buildCartPageViewModel({
      customerId: fixture.customer.id,
      notificationEvent: 'product-added',
    });

    assert(cartPage.page.items.length === 1, 'Cart should include one line item after add-to-cart.');
    assert(cartPage.page.items[0].quantity === 2, 'Cart quantity should match add-to-cart quantity.');
    assert(Boolean(cartPage.notification), 'Product-added notification should be present.');

    console.log('WF-010E Integration: test 2 cart update generates notification and recalculates totals');
    await facade.updateCartItemQuantity({
      customerId: fixture.customer.id,
      cartItemId: cartPage.page.items[0].cartItemId,
      quantity: 3,
    });

    const updatedCartPage = await facade.buildCartPageViewModel({
      customerId: fixture.customer.id,
      notificationEvent: 'cart-updated',
    });

    assert(updatedCartPage.page.items[0].quantity === 3, 'Cart update should persist the new quantity.');
    assert(updatedCartPage.page.cartTotal === 'R6,597', 'Cart total should reflect updated quantity and price.');

    console.log('WF-010E Integration: test 3 anonymous checkout redirects to login');
    const shoppingController = new ShoppingController();
    const anonymousReq = {
      originalUrl: '/checkout',
      path: '/checkout',
      query: {},
      body: {},
      params: {},
    } as any;
    const anonymousRes = createMockResponse() as any;

    await shoppingController.renderCheckout(anonymousReq, anonymousRes);

    assert(
      typeof anonymousRes.locals.redirectUrl === 'string' && anonymousRes.locals.redirectUrl.includes('/login?redirect='),
      'Anonymous checkout should redirect to login.',
    );

    console.log('WF-010E Integration: test 4 authenticated checkout renders');
    const checkoutPage = await facade.buildCheckoutPageViewModel({
      customerId: fixture.customer.id,
      notificationEvent: 'login-successful',
    });

    assert(checkoutPage.page.orderSummary.length === 1, 'Checkout should include cart summary item.');
    assert(checkoutPage.page.addressBook.length === 1, 'Checkout should include customer address book.');
    assert(checkoutPage.page.orderTotal === 'R6,597', 'Checkout total should match cart total.');

    console.log('WF-010E Integration: test 5 complete order creates order and confirmation');
    const placed = await facade.placeOrder({
      customerId: fixture.customer.id,
      billingAddressId: fixture.addressId,
      shippingAddressId: fixture.addressId,
      notes: 'WF-010E test order',
    });

    const confirmation = await facade.buildOrderConfirmationPageViewModel({
      customerId: fixture.customer.id,
      orderId: placed.orderId,
      notificationEvent: 'order-placed-successfully',
    });

    assert(Boolean(confirmation), 'Order confirmation should resolve after placing order.');
    assert(confirmation?.page.items.length === 1, 'Order confirmation should include ordered items.');
    assert(
      confirmation?.metadata.canonicalUrl === `/order-confirmation/${placed.orderId}`,
      'Order confirmation canonical URL should match order confirmation route.',
    );

    const order = await prisma.order.findUniqueOrThrow({
      where: {
        id: placed.orderId,
      },
    });

    assert(order.status === OrderStatus.PROCESSING, 'Placed order should be moved to PROCESSING by order processing workflow.');

    console.log('WF-010E Integration: test 6 customer account includes order history');
    const accountPage = await facade.buildCustomerAccountPageViewModel({
      customerId: fixture.customer.id,
      notificationEvent: 'order-confirmation-available',
    });

    assert(accountPage.page.currentOrders.length >= 1, 'Customer account should include current order in history.');
    assert(accountPage.page.currentOrders[0].orderId === placed.orderId, 'Account should include newly placed order id.');

    console.log('WF-010E Integration: test 7 inventory reservation updated');
    const inventory = await prisma.inventory.findUniqueOrThrow({
      where: {
        id: fixture.inventoryId,
      },
    });

    assert(inventory.quantityReserved === 3, 'Inventory reserved quantity should increase by ordered quantity.');

    console.log('WF-010E Integration: test 8 notification service generation');
    const checkoutNotification = notificationService.create('checkout-successful');

    assert(checkoutNotification.notifications.length === 1, 'Notification service should generate one notification for single event.');
    assert(
      checkoutNotification.notifications[0].title === 'Checkout Successful',
      'Notification title should match checkout-successful event mapping.',
    );

    console.log('WF-010E Integration: pass');
  } finally {
    console.log('WF-010E Integration: cleanup');
    await cleanup(runTag);
    await prisma.$disconnect();
  }
}

void run().catch((error) => {
  console.error('WF-010E Integration: fail');
  console.error(error);
  process.exitCode = 1;
});
