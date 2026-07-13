import { randomUUID } from 'node:crypto';

import { Prisma } from '@prisma/client';

import { prisma } from '../../src/infrastructure/database';
import {
  PriceSyncServiceError,
  priceSyncService,
} from '../../src/modules/workflows/price-sync/services';

function assert(
  condition: boolean,
  message: string,
): void {

  if (!condition) {
    throw new Error(message);
  }

}

function toMoney(
  value: number,
): Prisma.Decimal {

  return new Prisma.Decimal(
    Math.round((value + Number.EPSILON) * 100) / 100,
  );

}

function moneyEquals(
  value: Prisma.Decimal | null,
  expected: number,
): boolean {

  if (!value) {
    return false;
  }

  return value.toFixed(2) === toMoney(expected).toFixed(2);

}

async function expectPriceSyncError(
  dto: Parameters<typeof priceSyncService.synchronise>[0],
  expectedStatusCode: number,
): Promise<void> {

  try {

    await priceSyncService.synchronise(dto);

    throw new Error(`Expected workflow error with status ${expectedStatusCode}, but call succeeded.`);

  } catch (error) {

    if (!(error instanceof PriceSyncServiceError)) {
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
      name: `WF008 Sport ${runTag}`,
      code: `WF008-SP-${runTag}`,
      slug: `wf008-sp-${runTag}`,
    },

  });

  const category = await prisma.category.create({

    data: {
      name: `WF008 Category ${runTag}`,
      code: `WF008-CAT-${runTag}`,
      slug: `wf008-cat-${runTag}`,
      sportId: sport.id,
    },

  });

  const brand = await prisma.brand.create({

    data: {
      name: `WF008 Brand ${runTag}`,
      code: `WF008-BR-${runTag}`,
      slug: `wf008-br-${runTag}`,
      sportId: sport.id,
    },

  });

  const supplier = await prisma.supplier.create({

    data: {
      name: `WF008 Supplier ${runTag}`,
      code: `WF008-SUP-${runTag}`,
      slug: `wf008-sup-${runTag}`,
    },

  });

  return {
    sport,
    category,
    brand,
    supplier,
  };

}

async function createLinkedVariant(
  runTag: string,
  fixture: Awaited<ReturnType<typeof createCatalogFixture>>,
  suffix: string,
  options?: {
    supplierCost?: number;
    markupPercentage?: number;
    sellingPrice?: number;
    manualPriceOverride?: boolean;
  },
) {

  const product = await prisma.product.create({

    data: {
      name: `WF008 Product ${suffix} ${runTag}`,
      code: `WF008-PR-${suffix}-${runTag}`,
      slug: `wf008-pr-${suffix}-${runTag}`,
      sportId: fixture.sport.id,
      categoryId: fixture.category.id,
      brandId: fixture.brand.id,
    },

  });

  const variant = await prisma.productVariant.create({

    data: {
      name: `WF008 Variant ${suffix} ${runTag}`,
      sku: `WF008-SKU-${suffix}-${runTag}`,
      slug: `wf008-sku-${suffix}-${runTag}`,
      productId: product.id,
      supplierCost: options?.supplierCost,
      markupPercentage: options?.markupPercentage ?? 35,
      sellingPrice: options?.sellingPrice,
      manualPriceOverride: options?.manualPriceOverride ?? false,
    },

  });

  const supplierProduct = await prisma.supplierProduct.create({

    data: {
      supplierId: fixture.supplier.id,
      productVariantId: variant.id,
      supplierSku: `WF008-SUP-SKU-${suffix}-${runTag}`,
      supplierProductName: `WF008 Supplier Product ${suffix} ${runTag}`,
    },

  });

  return {
    product,
    variant,
    supplierProduct,
  };

}

async function cleanup(
  runTag: string,
): Promise<void> {

  await prisma.supplierProduct.deleteMany({
    where: {
      supplierSku: {
        endsWith: `-${runTag}`,
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

  await prisma.supplier.deleteMany({
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

}

async function run(): Promise<void> {

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run WF-008 integration checks.');
  }

  const runTag = Date.now().toString();

  try {

    console.log('WF-008 Integration: setup');

    const fixture = await createCatalogFixture(runTag);

    console.log('WF-008 Integration: scenario 404 (supplier not found)');

    await expectPriceSyncError(
      {
        supplierId: randomUUID(),
        products: [
          {
            supplierSku: `WF008-SUP-SKU-404-${runTag}`,
            supplierCost: 199.99,
          },
        ],
      },
      404,
    );

    console.log('WF-008 Integration: scenario changed cost -> recalculated selling price');

    const changedCost = await createLinkedVariant(
      runTag,
      fixture,
      'changed-cost',
      {
        supplierCost: 100,
        markupPercentage: 35,
        sellingPrice: 135,
      },
    );

    const changedCostResult = await priceSyncService.synchronise({
      supplierId: fixture.supplier.id,
      products: [
        {
          supplierSku: changedCost.supplierProduct.supplierSku,
          supplierCost: 3299.95,
        },
      ],
    });

    const changedCostVariant = await prisma.productVariant.findUniqueOrThrow({
      where: {
        id: changedCost.variant.id,
      },
    });

    assert(changedCostResult.processed === 1, 'Changed cost should process one row.');
    assert(changedCostResult.updated === 1, 'Changed cost should update one variant.');
    assert(changedCostResult.manualOverrides === 0, 'Changed cost should not increment manual overrides.');

    assert(
      moneyEquals(changedCostVariant.supplierCost, 3299.95),
      'Changed cost should update supplierCost to 3299.95.',
    );

    assert(
      moneyEquals(changedCostVariant.sellingPrice, 4454.93),
      'Changed cost should recalculate sellingPrice to 4454.93.',
    );

    console.log('WF-008 Integration: scenario unchanged cost -> no update');

    const unchanged = await createLinkedVariant(
      runTag,
      fixture,
      'unchanged-cost',
      {
        supplierCost: 2899.95,
        markupPercentage: 35,
        sellingPrice: 3914.93,
      },
    );

    const unchangedBefore = await prisma.productVariant.findUniqueOrThrow({
      where: {
        id: unchanged.variant.id,
      },
    });

    const unchangedResult = await priceSyncService.synchronise({
      supplierId: fixture.supplier.id,
      products: [
        {
          supplierSku: unchanged.supplierProduct.supplierSku,
          supplierCost: 2899.95,
        },
      ],
    });

    const unchangedAfter = await prisma.productVariant.findUniqueOrThrow({
      where: {
        id: unchanged.variant.id,
      },
    });

    assert(unchangedResult.processed === 1, 'Unchanged scenario should process one row.');
    assert(unchangedResult.updated === 0, 'Unchanged scenario should not update any variant.');
    assert(unchangedResult.manualOverrides === 0, 'Unchanged scenario should not increment manual overrides.');

    assert(
      unchangedAfter.updatedAt.getTime() === unchangedBefore.updatedAt.getTime(),
      'Unchanged scenario should keep updatedAt unchanged.',
    );

    console.log('WF-008 Integration: scenario manual override -> supplier cost only');

    const manualOverride = await createLinkedVariant(
      runTag,
      fixture,
      'manual-override',
      {
        supplierCost: 200,
        markupPercentage: 35,
        sellingPrice: 8888.88,
        manualPriceOverride: true,
      },
    );

    const manualResult = await priceSyncService.synchronise({
      supplierId: fixture.supplier.id,
      products: [
        {
          supplierSku: manualOverride.supplierProduct.supplierSku,
          supplierCost: 400,
        },
      ],
    });

    const manualAfter = await prisma.productVariant.findUniqueOrThrow({
      where: {
        id: manualOverride.variant.id,
      },
    });

    assert(manualResult.processed === 1, 'Manual override scenario should process one row.');
    assert(manualResult.updated === 1, 'Manual override scenario should update supplierCost.');
    assert(manualResult.manualOverrides === 1, 'Manual override scenario should increment manualOverrides.');

    assert(
      moneyEquals(manualAfter.supplierCost, 400),
      'Manual override scenario should update supplierCost.',
    );

    assert(
      moneyEquals(manualAfter.sellingPrice, 8888.88),
      'Manual override scenario should preserve sellingPrice.',
    );

    console.log('WF-008 Integration: scenario rollback');

    const rollback = await createLinkedVariant(
      runTag,
      fixture,
      'rollback',
      {
        supplierCost: 100,
        markupPercentage: 35,
        sellingPrice: 135,
      },
    );

    const rollbackBefore = await prisma.productVariant.findUniqueOrThrow({
      where: {
        id: rollback.variant.id,
      },
    });

    await expectPriceSyncError(
      {
        supplierId: fixture.supplier.id,
        forceRollback: true,
        products: [
          {
            supplierSku: rollback.supplierProduct.supplierSku,
            supplierCost: 200,
          },
        ],
      },
      500,
    );

    const rollbackAfter = await prisma.productVariant.findUniqueOrThrow({
      where: {
        id: rollback.variant.id,
      },
    });

    assert(
      rollbackAfter.updatedAt.getTime() === rollbackBefore.updatedAt.getTime(),
      'Rollback scenario should keep updatedAt unchanged.',
    );

    assert(
      moneyEquals(rollbackAfter.supplierCost, Number(rollbackBefore.supplierCost ?? 0)),
      'Rollback scenario should revert supplierCost.',
    );

    assert(
      moneyEquals(rollbackAfter.sellingPrice, Number(rollbackBefore.sellingPrice ?? 0)),
      'Rollback scenario should revert sellingPrice.',
    );

    console.log('WF-008 Integration: all scenarios passed');

  } finally {

    await cleanup(runTag);

  }

}

void run()
  .catch(async (error) => {
    console.error('WF-008 Integration: failed');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
