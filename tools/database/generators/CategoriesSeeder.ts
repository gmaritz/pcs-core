import { RecordStatus } from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

export class CategoriesSeeder {
  async run(context: SeedContext): Promise<number> {
    const sports = await context.db.sport.findMany({
      where: {
        code: {
          in: context.dataset.sports.map((item) => item.code),
        },
      },
    });

    const sportsByCode = new Map(sports.map((sport) => [sport.code, sport.id]));

    for (const category of context.dataset.categories) {
      const sportId = sportsByCode.get(category.sportCode);

      if (!sportId) {
        throw new Error(`Category ${category.code} references missing sport ${category.sportCode}.`);
      }

      await context.db.category.upsert({
        where: {
          code: category.code,
        },
        create: {
          code: category.code,
          name: category.name,
          slug: category.slug,
          description: category.description,
          displayOrder: category.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
          sport: {
            connect: {
              id: sportId,
            },
          },
        },
        update: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          displayOrder: category.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
          sportId,
        },
      });
    }

    return context.dataset.categories.length;
  }
}
