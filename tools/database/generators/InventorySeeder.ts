import {
  InventoryStatus,
  RecordStatus,
} from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

function deterministicNumber(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(index);
    hash |= 0;
  }

  const range = Math.max(1, (max - min) + 1);
  const normalized = Math.abs(hash) % range;
  return min + normalized;
}

export class InventorySeeder {
  async run(context: SeedContext): Promise<number> {
    for (const warehouse of context.dataset.inventory.warehouses) {
      await context.db.warehouse.upsert({
        where: {
          code: warehouse.code,
        },
        create: {
          code: warehouse.code,
          name: warehouse.name,
          slug: warehouse.slug,
          city: warehouse.city,
          province: warehouse.province,
          country: warehouse.country,
          displayOrder: warehouse.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
        },
        update: {
          name: warehouse.name,
          slug: warehouse.slug,
          city: warehouse.city,
          province: warehouse.province,
          country: warehouse.country,
          displayOrder: warehouse.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
        },
      });
    }

    const defaultWarehouse = await context.db.warehouse.findFirst({
      where: {
        code: context.dataset.inventory.warehouses[0]?.code,
      },
    });

    if (!defaultWarehouse) {
      throw new Error('Inventory seeding requires at least one warehouse.');
    }

    const variants = await context.db.productVariant.findMany({
      orderBy: {
        sku: 'asc',
      },
    });

    for (const variant of variants) {
      const quantityOnHand = deterministicNumber(
        `${variant.sku}-on-hand`,
        context.dataset.inventory.quantityOnHand.minimum,
        context.dataset.inventory.quantityOnHand.maximum,
      );

      const quantityReserved = deterministicNumber(
        `${variant.sku}-reserved`,
        context.dataset.inventory.quantityReserved.minimum,
        context.dataset.inventory.quantityReserved.maximum,
      );

      await context.db.inventory.upsert({
        where: {
          productVariantId: variant.id,
        },
        create: {
          quantityOnHand,
          quantityReserved,
          reorderLevel: context.dataset.inventory.reorderLevel,
          status: quantityOnHand <= 0 ? InventoryStatus.OUT_OF_STOCK : InventoryStatus.IN_STOCK,
          warehouse: {
            connect: {
              id: defaultWarehouse.id,
            },
          },
          productVariant: {
            connect: {
              id: variant.id,
            },
          },
        },
        update: {
          quantityOnHand,
          quantityReserved,
          reorderLevel: context.dataset.inventory.reorderLevel,
          status: quantityOnHand <= 0 ? InventoryStatus.OUT_OF_STOCK : InventoryStatus.IN_STOCK,
          warehouseId: defaultWarehouse.id,
        },
      });
    }

    return variants.length;
  }
}
