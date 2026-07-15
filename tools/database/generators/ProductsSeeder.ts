import { RecordStatus } from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

function sanitizeCode(value: string): string {
  return value.replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class ProductsSeeder {
  async run(context: SeedContext): Promise<number> {
    const categories = await context.db.category.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
      include: {
        sport: true,
      },
    });

    const brands = await context.db.brand.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    const brandsBySportId = new Map<string, typeof brands>();
    for (const brand of brands) {
      const list = brandsBySportId.get(brand.sportId) ?? [];
      list.push(brand);
      brandsBySportId.set(brand.sportId, list);
    }

    let generatedCount = 0;

    for (const category of categories) {
      const noun = context.dataset.products.categoryNouns[category.code] ?? 'Item';
      const sportBrands = brandsBySportId.get(category.sportId);

      if (!sportBrands || sportBrands.length === 0) {
        throw new Error(`No brands available for sport ${category.sport.code}.`);
      }

      for (let index = 0; index < context.dataset.products.perCategory; index += 1) {
        const sequence = index + 1;
        const prefix = context.dataset.products.namePrefixes[(generatedCount + index) % context.dataset.products.namePrefixes.length];
        const series = context.dataset.products.nameSeries[(generatedCount + index) % context.dataset.products.nameSeries.length];
        const brand = sportBrands[index % sportBrands.length];

        const name = `${brand.name} ${prefix} ${noun} ${series}`;
        const code = `PRD-${sanitizeCode(category.code)}-${sequence.toString().padStart(2, '0')}`;
        const slug = slugify(`${brand.slug}-${category.slug}-${prefix}-${series}-${sequence}`);
        const isFeatured = (generatedCount + 1) % context.dataset.products.featuredEvery === 0;

        await context.db.product.upsert({
          where: {
            code,
          },
          create: {
            code,
            name,
            slug,
            shortDescription: `${prefix} ${noun} for ${category.sport.name.toLowerCase()} performance.`,
            description: `${name} is part of the PCS canonical dataset and models realistic ecommerce catalogue data for ${category.sport.name}.`,
            isFeatured,
            displayOrder: generatedCount + 1,
            status: RecordStatus.ACTIVE,
            sport: {
              connect: {
                id: category.sportId,
              },
            },
            category: {
              connect: {
                id: category.id,
              },
            },
            brand: {
              connect: {
                id: brand.id,
              },
            },
          },
          update: {
            name,
            slug,
            shortDescription: `${prefix} ${noun} for ${category.sport.name.toLowerCase()} performance.`,
            description: `${name} is part of the PCS canonical dataset and models realistic ecommerce catalogue data for ${category.sport.name}.`,
            isFeatured,
            displayOrder: generatedCount + 1,
            status: RecordStatus.ACTIVE,
            sportId: category.sportId,
            categoryId: category.id,
            brandId: brand.id,
          },
        });

        generatedCount += 1;
      }
    }

    return generatedCount;
  }
}
