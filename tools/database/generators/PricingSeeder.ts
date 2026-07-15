import { pricingService } from '../../../src/modules/pricing/services';

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

function resolveCostBand(categoryCode: string, context: SeedContext): { minimum: number; maximum: number } {
  const entry = Object.entries(context.dataset.pricing.categoryCostBands)
    .find(([needle]) => categoryCode.includes(needle));

  if (!entry) {
    return context.dataset.pricing.defaultCostBand;
  }

  return entry[1];
}

export class PricingSeeder {
  async run(context: SeedContext): Promise<number> {
    const variants = await context.db.productVariant.findMany({
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
      orderBy: {
        sku: 'asc',
      },
    });

    const suppliers = await context.db.supplier.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    if (suppliers.length === 0) {
      throw new Error('Pricing seeding requires suppliers to be present.');
    }

    for (const variant of variants) {
      const band = resolveCostBand(variant.product.category.code, context);
      const supplierCost = deterministicNumber(`${variant.sku}-supplier-cost`, band.minimum, band.maximum);
      const calculated = pricingService.calculateFromSupplierCost({
        supplierCost,
        markupPercentage: context.dataset.pricing.defaultMarkupPercentage,
      });

      await context.db.productVariant.update({
        where: {
          id: variant.id,
        },
        data: {
          supplierCost: calculated.supplierCost,
          costPrice: calculated.supplierCost,
          markupPercentage: calculated.markupPercentage,
          sellingPrice: calculated.sellingPrice,
        },
      });

      const latestPrice = await context.db.priceHistory.findFirst({
        where: {
          productVariantId: variant.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!latestPrice || Number(latestPrice.costPrice) !== calculated.supplierCost || Number(latestPrice.sellingPrice ?? 0) !== calculated.sellingPrice) {
        await context.db.priceHistory.create({
          data: {
            costPrice: calculated.supplierCost,
            sellingPrice: calculated.sellingPrice,
            productVariant: {
              connect: {
                id: variant.id,
              },
            },
          },
        });
      }

      const supplier = suppliers[Math.abs(variant.product.displayOrder) % suppliers.length];

      await context.db.supplierProduct.upsert({
        where: {
          supplierId_productVariantId: {
            supplierId: supplier.id,
            productVariantId: variant.id,
          },
        },
        create: {
          supplierSku: `SUP-${supplier.code}-${variant.sku}`,
          supplierProductName: variant.name,
          supplierPrice: calculated.supplierCost,
          supplier: {
            connect: {
              id: supplier.id,
            },
          },
          productVariant: {
            connect: {
              id: variant.id,
            },
          },
        },
        update: {
          supplierSku: `SUP-${supplier.code}-${variant.sku}`,
          supplierProductName: variant.name,
          supplierPrice: calculated.supplierCost,
          active: true,
        },
      });
    }

    return variants.length;
  }
}
