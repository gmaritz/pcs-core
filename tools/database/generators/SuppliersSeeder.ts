import { RecordStatus } from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

export class SuppliersSeeder {
  async run(context: SeedContext): Promise<number> {
    for (const supplier of context.dataset.suppliers) {
      await context.db.supplier.upsert({
        where: {
          code: supplier.code,
        },
        create: {
          code: supplier.code,
          name: supplier.name,
          slug: supplier.slug,
          website: supplier.website,
          email: supplier.email,
          telephone: supplier.telephone,
          description: supplier.description,
          displayOrder: supplier.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
        },
        update: {
          name: supplier.name,
          slug: supplier.slug,
          website: supplier.website,
          email: supplier.email,
          telephone: supplier.telephone,
          description: supplier.description,
          displayOrder: supplier.displayOrder ?? 0,
          status: RecordStatus.ACTIVE,
        },
      });
    }

    return context.dataset.suppliers.length;
  }
}
