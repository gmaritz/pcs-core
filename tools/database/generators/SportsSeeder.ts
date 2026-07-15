import { RecordStatus } from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

export class SportsSeeder {
  async run(context: SeedContext): Promise<number> {
    for (const sport of context.dataset.sports) {
      await context.db.sport.upsert({
        where: {
          code: sport.code,
        },
        create: {
          code: sport.code,
          name: sport.name,
          slug: sport.slug,
          description: sport.description,
          displayOrder: sport.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
        },
        update: {
          name: sport.name,
          slug: sport.slug,
          description: sport.description,
          displayOrder: sport.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
        },
      });
    }

    return context.dataset.sports.length;
  }
}
