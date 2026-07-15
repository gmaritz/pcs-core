import { RecordStatus } from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

export class CustomersSeeder {
  async run(context: SeedContext): Promise<number> {
    const count = context.dataset.customers.count;

    for (let index = 0; index < count; index += 1) {
      const firstName = context.dataset.customers.firstNames[index % context.dataset.customers.firstNames.length] ?? `Customer${index + 1}`;
      const lastName = context.dataset.customers.lastNames[index % context.dataset.customers.lastNames.length] ?? 'Demo';
      const customerNumber = (index + 1).toString().padStart(2, '0');
      const email = `customer-${customerNumber}@${context.dataset.customers.emailDomain}`;
      const telephoneSuffix = (1000 + index).toString().slice(-4);
      const createdAt = new Date(Date.now() - ((context.dataset.customers.accountAgeStartDays - (index * context.dataset.customers.accountAgeStepDays)) * 24 * 60 * 60 * 1000));

      const customer = await context.db.customer.upsert({
        where: {
          email,
        },
        create: {
          firstName,
          lastName,
          email,
          telephone: `${context.dataset.customers.telephonePrefix}${telephoneSuffix}`,
          status: RecordStatus.ACTIVE,
          createdAt,
        },
        update: {
          firstName,
          lastName,
          telephone: `${context.dataset.customers.telephonePrefix}${telephoneSuffix}`,
          status: RecordStatus.ACTIVE,
        },
      });

      const city = context.dataset.customers.cities[index % context.dataset.customers.cities.length] ?? 'Cape Town';
      const province = context.dataset.customers.provinces[index % context.dataset.customers.provinces.length] ?? 'Western Cape';
      const postalCode = context.dataset.customers.postalCodes[index % context.dataset.customers.postalCodes.length] ?? '8001';

      await this.upsertAddress(context, customer.id, 'SHIPPING', `${index + 1} Court Lane`, city, province, postalCode);
      await this.upsertAddress(context, customer.id, 'BILLING', `${index + 1} Invoice Street`, city, province, postalCode);
    }

    return count;
  }

  private async upsertAddress(
    context: SeedContext,
    customerId: string,
    type: 'SHIPPING' | 'BILLING',
    line1: string,
    city: string,
    province: string,
    postalCode: string,
  ): Promise<void> {
    const existing = await context.db.address.findFirst({
      where: {
        customerId,
        type,
      },
    });

    if (existing) {
      await context.db.address.update({
        where: {
          id: existing.id,
        },
        data: {
          line1,
          city,
          province,
          postalCode,
          country: 'South Africa',
        },
      });
      return;
    }

    await context.db.address.create({
      data: {
        type,
        line1,
        city,
        province,
        postalCode,
        country: 'South Africa',
        customer: {
          connect: {
            id: customerId,
          },
        },
      },
    });
  }
}
