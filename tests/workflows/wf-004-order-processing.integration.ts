import { randomUUID } from 'node:crypto';

import {
  InventoryMovementType,
  OrderStatus,
} from '@prisma/client';

import { prisma } from '../../src/infrastructure/database';
import {
  OrderProcessingServiceError,
  orderProcessingService,
} from '../../src/modules/workflows/order-processing/services';

function assert(
  condition: boolean,
  message: string,
): void {

  if (!condition) {
    throw new Error(message);
  }

}

async function expectOrderProcessingError(
  orderId: string,
  expectedStatusCode: number,
): Promise<void> {

  try {

    await orderProcessingService.processOrder({
      orderId,
    });

    throw new Error(`Expected workflow error with status ${expectedStatusCode}, but call succeeded.`);

  } catch (error) {

    if (!(error instanceof OrderProcessingServiceError)) {
      throw error;
    }

    assert(
      error.statusCode === expectedStatusCode,
      `Expected status ${expectedStatusCode}, received ${error.statusCode}.`,
    );

  }

}

async function createCatalogFixture(
  runTag: string,
) {

  const sport = await prisma.sport.create({

    data: {
      name: `WF004 Sport ${runTag}`,
      code: `WF004-SP-${runTag}`,
      slug: `wf004-sp-${runTag}`,
    },

  });

  const category = await prisma.category.create({

    data: {
      name: `WF004 Category ${runTag}`,
      code: `WF004-CAT-${runTag}`,
      slug: `wf004-cat-${runTag}`,
      sportId: sport.id,
    },

  });

  const brand = await prisma.brand.create({

    data: {
      name: `WF004 Brand ${runTag}`,
      code: `WF004-BR-${runTag}`,
      slug: `wf004-br-${runTag}`,
      sportId: sport.id,
    },

  });

  return {
    sport,
    category,
    brand,
  };

}

async function createVariantWithInventory(
  runTag: string,
  fixture: Awaited<ReturnType<typeof createCatalogFixture>>,
  suffix: string,
  quantityOnHand: number,
  quantityReserved = 0,
) {

  const product = await prisma.product.create({

    data: {
      name: `WF004 Product ${suffix} ${runTag}`,
      code: `WF004-PR-${suffix}-${runTag}`,
      slug: `wf004-pr-${suffix}-${runTag}`,
      sportId: fixture.sport.id,
      categoryId: fixture.category.id,
      brandId: fixture.brand.id,
    },

  });

  const variant = await prisma.productVariant.create({

    data: {
      name: `WF004 Variant ${suffix} ${runTag}`,
      sku: `WF004-SKU-${suffix}-${runTag}`,
      slug: `wf004-sku-${suffix}-${runTag}`,
      productId: product.id,
    },

  });

  const inventory = await prisma.inventory.create({

    data: {
      productVariantId: variant.id,
      quantityOnHand,
      quantityReserved,
    },

  });

  return {
    product,
    variant,
    inventory,
  };

}

async function createOrderWithItem(
  runTag: string,
  suffix: string,
  customerId: string,
  productVariantId: string,
  quantity: number,
  status: OrderStatus,
) {

  const order = await prisma.order.create({

    data: {
      orderNumber: `WF004-ORD-${suffix}-${runTag}`,
      customerId,
      status,
    },

  });

  await prisma.orderItem.create({

    data: {
      orderId: order.id,
      productVariantId,
      quantity,
    },

  });

  return order;

}

async function cleanup(
  runTag: string,
): Promise<void> {

  await prisma.inventoryMovement.deleteMany({
    where: {
      inventory: {
        productVariant: {
          sku: {
            endsWith: `-${runTag}`,
          },
        },
      },
    },
  });

  await prisma.orderItem.deleteMany({
    where: {
      order: {
        orderNumber: {
          endsWith: `-${runTag}`,
        },
      },
    },
  });

  await prisma.order.deleteMany({
    where: {
      orderNumber: {
        endsWith: `-${runTag}`,
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
      email: `wf004+${runTag}@example.com`,
    },
  });

}

async function run(): Promise<void> {

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run WF-004 integration checks.');
  }

  const runTag = Date.now().toString();

  try {

    console.log('WF-004 Integration: setup');

    const fixture = await createCatalogFixture(runTag);

    const customer = await prisma.customer.create({

    data: {
      firstName: 'WF004',
      lastName: `Runner ${runTag}`,
      email: `wf004+${runTag}@example.com`,
    },

  });

    console.log('WF-004 Integration: scenario 404 (order not found)');

    await expectOrderProcessingError(
      randomUUID(),
      404,
    );

    console.log('WF-004 Integration: scenario 400 (order already processed)');

    const alreadyProcessedFixture =
      await createVariantWithInventory(
        runTag,
        fixture,
        'already-processed',
        20,
        0,
      );

    const alreadyProcessedOrder = await createOrderWithItem(
      runTag,
      'already-processed',
      customer.id,
      alreadyProcessedFixture.variant.id,
      1,
      OrderStatus.PROCESSING,
    );

    await expectOrderProcessingError(
      alreadyProcessedOrder.id,
      400,
    );

    console.log('WF-004 Integration: scenario 409 (inventory shortage)');

    const shortageFixture = await createVariantWithInventory(
      runTag,
      fixture,
      'shortage',
      2,
      0,
    );

    const shortageOrder = await createOrderWithItem(
      runTag,
      'shortage',
      customer.id,
      shortageFixture.variant.id,
      3,
      OrderStatus.PENDING,
    );

    await expectOrderProcessingError(
      shortageOrder.id,
      409,
    );

    const shortageOrderAfter = await prisma.order.findUniqueOrThrow({
      where: {
        id: shortageOrder.id,
      },
    });

    assert(
      shortageOrderAfter.status === OrderStatus.PENDING,
      'Shortage scenario should leave order in PENDING status.',
    );

    const shortageInventoryAfter = await prisma.inventory.findUniqueOrThrow({
      where: {
        id: shortageFixture.inventory.id,
      },
    });

    assert(
      shortageInventoryAfter.quantityReserved === 0,
      'Shortage scenario should not reserve inventory.',
    );

    console.log('WF-004 Integration: scenario success');

    const successFixture = await createVariantWithInventory(
      runTag,
      fixture,
      'success',
      10,
      0,
    );

    const successOrder = await createOrderWithItem(
      runTag,
      'success',
      customer.id,
      successFixture.variant.id,
      4,
      OrderStatus.PENDING,
    );

    const successResult = await orderProcessingService.processOrder({
      orderId: successOrder.id,
    });

    assert(
      successResult.order.status === OrderStatus.PROCESSING,
      'Success scenario should update order to PROCESSING.',
    );

    assert(
      successResult.inventoryMovements.length === 1,
      'Success scenario should create one inventory movement.',
    );

    assert(
      successResult.inventoryMovements[0].movementType === InventoryMovementType.RESERVED,
      'Success scenario should persist RESERVED movement type.',
    );

    assert(
      successResult.inventory[0].quantityReserved === 4,
      'Success scenario should increase reserved quantity.',
    );

    console.log('WF-004 Integration: scenario rollback');

    const rollbackFixture = await createVariantWithInventory(
      runTag,
      fixture,
      'rollback',
      15,
      1,
    );

    const rollbackOrder = await createOrderWithItem(
      runTag,
      'rollback',
      customer.id,
      rollbackFixture.variant.id,
      5,
      OrderStatus.PENDING,
    );

    const rollbackInventoryBefore =
      await prisma.inventory.findUniqueOrThrow({
        where: {
          id: rollbackFixture.inventory.id,
        },
      });

    process.env.WF004_FORCE_EXCEPTION_AFTER_FIRST_MOVEMENT = 'true';

    try {

      await expectOrderProcessingError(
        rollbackOrder.id,
        500,
      );

    } finally {

      delete process.env.WF004_FORCE_EXCEPTION_AFTER_FIRST_MOVEMENT;

    }

    const rollbackOrderAfter = await prisma.order.findUniqueOrThrow({
      where: {
        id: rollbackOrder.id,
      },
    });

    const rollbackInventoryAfter = await prisma.inventory.findUniqueOrThrow({
      where: {
        id: rollbackFixture.inventory.id,
      },
    });

    const rollbackMovements = await prisma.inventoryMovement.findMany({
      where: {
        reference: `ORDER:${rollbackOrder.id}`,
      },
    });

    assert(
      rollbackOrderAfter.status === OrderStatus.PENDING,
      'Rollback scenario should keep order in PENDING status.',
    );

    assert(
      rollbackInventoryAfter.quantityReserved === rollbackInventoryBefore.quantityReserved,
      'Rollback scenario should restore inventory reservation state.',
    );

    assert(
      rollbackMovements.length === 0,
      'Rollback scenario should not persist inventory movements.',
    );

    console.log('WF-004 Integration: all scenarios passed');

  } finally {

    await cleanup(runTag);

  }

}

void run()
  .catch(async (error) => {
    console.error('WF-004 Integration: failed');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
