import {
  RecordStatus,
  type Product,
} from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type VariantOption = {
  code: string;
  label: string;
};

export class ProductVariantsSeeder {
  private resolveOptions(categoryCode: string, context: SeedContext): VariantOption[] {
    const profile = context.dataset.variants.profiles.find((item) => categoryCode.includes(item.categoryCodeContains));
    return profile?.options ?? context.dataset.variants.defaultOptions;
  }

  async run(context: SeedContext): Promise<number> {
    const products = await context.db.product.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
      include: {
        category: true,
      },
    });

    let createdCount = 0;

    for (const product of products) {
      const options = this.resolveOptions(product.category.code, context);

      for (let index = 0; index < options.length; index += 1) {
        const option = options[index];
        const sku = `${product.code}-${option.code}`;
        const slug = slugify(`${product.slug}-${option.code}`);
        const variantName = `${product.name} ${option.label}`;

        await context.db.productVariant.upsert({
          where: {
            sku,
          },
          create: {
            name: variantName,
            sku,
            slug,
            description: `${option.label} variant for ${product.name}.`,
            displayOrder: index + 1,
            isDefault: index === 0,
            status: RecordStatus.ACTIVE,
            product: {
              connect: {
                id: product.id,
              },
            },
          },
          update: {
            name: variantName,
            slug,
            description: `${option.label} variant for ${product.name}.`,
            displayOrder: index + 1,
            isDefault: index === 0,
            status: RecordStatus.ACTIVE,
            productId: product.id,
          },
        });

        createdCount += 1;
      }
    }

    await this.seedProductSpecifications(context, products);

    return createdCount;
  }

  private async seedProductSpecifications(context: SeedContext, products: Array<Product & { category: { code: string } }>): Promise<void> {
    const specifications = await context.db.specification.findMany({
      include: {
        sport: true,
      },
    });

    const valueMap = new Map(
      context.dataset.attributeValues.map((item) => [item.specificationCode, item.values]),
    );

    for (const product of products) {
      const productSpecifications = specifications.filter((specification) => specification.sportId === product.sportId);

      for (const specification of productSpecifications) {
        const values = valueMap.get(specification.code) ?? ['Standard'];
        const value = values[product.displayOrder % values.length] ?? 'Standard';

        await context.db.productSpecification.upsert({
          where: {
            productId_specificationId: {
              productId: product.id,
              specificationId: specification.id,
            },
          },
          create: {
            value,
            product: {
              connect: {
                id: product.id,
              },
            },
            specification: {
              connect: {
                id: specification.id,
              },
            },
          },
          update: {
            value,
          },
        });
      }
    }
  }
}
