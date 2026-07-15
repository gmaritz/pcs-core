import {
  RecordStatus,
  SpecificationDataType,
} from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

export class AttributesSeeder {
  async run(context: SeedContext): Promise<number> {
    const sports = await context.db.sport.findMany({
      where: {
        code: {
          in: context.dataset.sports.map((item) => item.code),
        },
      },
    });

    const sportsByCode = new Map(sports.map((sport) => [sport.code, sport.id]));

    for (const attribute of context.dataset.attributes) {
      const sportId = sportsByCode.get(attribute.sportCode);

      if (!sportId) {
        throw new Error(`Specification ${attribute.code} references missing sport ${attribute.sportCode}.`);
      }

      await context.db.specification.upsert({
        where: {
          code: attribute.code,
        },
        create: {
          code: attribute.code,
          name: attribute.name,
          slug: attribute.slug,
          dataType: attribute.dataType as SpecificationDataType,
          unit: attribute.unit ?? undefined,
          description: attribute.description,
          displayOrder: attribute.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
          sport: {
            connect: {
              id: sportId,
            },
          },
        },
        update: {
          name: attribute.name,
          slug: attribute.slug,
          dataType: attribute.dataType as SpecificationDataType,
          unit: attribute.unit ?? undefined,
          description: attribute.description,
          displayOrder: attribute.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
          sportId,
        },
      });
    }

    return context.dataset.attributes.length;
  }
}
