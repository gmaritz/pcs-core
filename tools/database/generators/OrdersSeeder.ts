import {
  OrderStatus,
  PaymentChannel,
  PaymentStatus,
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

function createStatusSequence(context: SeedContext): OrderStatus[] {
  const sequence: OrderStatus[] = [];

  const entries: Array<[OrderStatus, number]> = [
    [OrderStatus.PENDING, context.dataset.orders.statuses.PENDING],
    [OrderStatus.PROCESSING, context.dataset.orders.statuses.PROCESSING],
    [OrderStatus.COMPLETED, context.dataset.orders.statuses.COMPLETED],
    [OrderStatus.CANCELLED, context.dataset.orders.statuses.CANCELLED],
  ];

  for (const [status, amount] of entries) {
    for (let index = 0; index < amount; index += 1) {
      sequence.push(status);
    }
  }

  return sequence;
}

export class OrdersSeeder {
  async run(context: SeedContext): Promise<number> {
    const customers = await context.db.customer.findMany({
      include: {
        addresses: true,
      },
      orderBy: {
        email: 'asc',
      },
    });

    const variants = await context.db.productVariant.findMany({
      where: {
        sellingPrice: {
          not: null,
        },
      },
      orderBy: {
        sku: 'asc',
      },
    });

    if (customers.length === 0 || variants.length === 0) {
      throw new Error('Orders seeding requires customers and priced variants.');
    }

    const statuses = createStatusSequence(context);

    for (let index = 0; index < context.dataset.orders.count; index += 1) {
      const orderNumber = `ORD-${(index + 1).toString().padStart(6, '0')}`;
      const customer = customers[index % customers.length];
      const shippingAddress = customer.addresses.find((address) => address.type === 'SHIPPING') ?? customer.addresses[0];
      const billingAddress = customer.addresses.find((address) => address.type === 'BILLING') ?? customer.addresses[0];
      const status = statuses[index % statuses.length] ?? OrderStatus.PENDING;
      const note = context.dataset.orders.notes[index % context.dataset.orders.notes.length];

      const order = await context.db.order.upsert({
        where: {
          orderNumber,
        },
        create: {
          orderNumber,
          notes: note,
          status,
          customer: {
            connect: {
              id: customer.id,
            },
          },
          billingAddress: billingAddress ? { connect: { id: billingAddress.id } } : undefined,
          shippingAddress: shippingAddress ? { connect: { id: shippingAddress.id } } : undefined,
        },
        update: {
          notes: note,
          status,
          customerId: customer.id,
          billingAddressId: billingAddress?.id,
          shippingAddressId: shippingAddress?.id,
        },
      });

      await context.db.orderItem.deleteMany({
        where: {
          orderId: order.id,
        },
      });

      const itemCount = deterministicNumber(
        `${order.orderNumber}-item-count`,
        context.dataset.orders.itemsPerOrder.minimum,
        context.dataset.orders.itemsPerOrder.maximum,
      );

      let orderTotal = 0;

      for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
        const variant = variants[(index + itemIndex) % variants.length];
        const quantity = deterministicNumber(`${order.orderNumber}-${variant.sku}-qty`, 1, 3);
        const unitPrice = Number(variant.sellingPrice ?? 0);
        const totalPrice = unitPrice * quantity;

        orderTotal += totalPrice;

        await context.db.orderItem.create({
          data: {
            order: {
              connect: {
                id: order.id,
              },
            },
            productVariant: {
              connect: {
                id: variant.id,
              },
            },
            quantity,
            unitPrice,
            totalPrice,
          },
        });
      }

      await context.db.payment.upsert({
        where: {
          paymentReference: `PAY-${order.orderNumber}`,
        },
        create: {
          paymentReference: `PAY-${order.orderNumber}`,
          amount: orderTotal,
          currency: 'ZAR',
          method: PaymentChannel.EFT,
          status: status === OrderStatus.CANCELLED ? PaymentStatus.CANCELLED : PaymentStatus.PAID,
          order: {
            connect: {
              id: order.id,
            },
          },
        },
        update: {
          amount: orderTotal,
          method: PaymentChannel.EFT,
          status: status === OrderStatus.CANCELLED ? PaymentStatus.CANCELLED : PaymentStatus.PAID,
          orderId: order.id,
        },
      });
    }

    return context.dataset.orders.count;
  }
}
