import { RecordStatus } from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

export class BrandsSeeder {
  async run(context: SeedContext): Promise<number> {
    const sports = await context.db.sport.findMany({
      where: {
        code: {
          in: context.dataset.sports.map((item) => item.code),
        },
      },
    });

    const sportsByCode = new Map(sports.map((sport) => [sport.code, sport.id]));

    for (const brand of context.dataset.brands) {
      const sportId = sportsByCode.get(brand.sportCode);

      if (!sportId) {
        throw new Error(`Brand ${brand.code} references missing sport ${brand.sportCode}.`);
      }

      await context.db.brand.upsert({
        where: {
          code: brand.code,
        },
        create: {
          code: brand.code,
          name: brand.name,
          slug: brand.slug,
          website: brand.website,
          description: brand.description,
          displayOrder: brand.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
          sport: {
            connect: {
              id: sportId,
            },
          },
        },
        update: {
          name: brand.name,
          slug: brand.slug,
          website: brand.website,
          description: brand.description,
          displayOrder: brand.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
          sportId,
        },
      });
    }

    return context.dataset.brands.length;
  }
}
