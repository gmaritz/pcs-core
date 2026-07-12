// ==========================================================
// Imports
// ==========================================================

import {
  Order,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

import {
  CreateOrderDto,
  UpdateOrderDto,
} from '../types/order.dto';

// ==========================================================
// Order Service
// ==========================================================

export class OrderService extends BaseService {

  private readonly defaultDbClient: PrismaClient = this.db;

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single order by its unique identifier.
   */
  async getOrder(
    id: string,
  ): Promise<Order | null> {

    return this.db.order.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve orders.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getOrders(
    options?: Prisma.OrderFindManyArgs,
  ): Promise<Order[]> {

    return this.db.order.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new order.
   */
  async createOrder(
    dto: CreateOrderDto,
    dbClient?: Prisma.TransactionClient,
  ): Promise<Order> {

    const client = dbClient ?? this.defaultDbClient;

    const orderNumber = await this.generateOrderNumber(
      client,
    );

    const data: Prisma.OrderCreateInput = {

      orderNumber,

      notes: dto.notes,

      customer: {
        connect: {
          id: dto.customerId,
        },
      },

    };

    if (dto.billingAddressId !== undefined) {

      data.billingAddress = {
        connect: {
          id: dto.billingAddressId,
        },
      };

    }

    if (dto.shippingAddressId !== undefined) {

      data.shippingAddress = {
        connect: {
          id: dto.shippingAddressId,
        },
      };

    }

    return client.order.create({

      data,

    });

  }

  /**
   * Update an existing order.
   */
  async updateOrder(
    id: string,
    dto: UpdateOrderDto,
  ): Promise<Order> {

    const data: Prisma.OrderUpdateInput = {};

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (dto.notes !== undefined) {
      data.notes = dto.notes;
    }

    if (dto.billingAddressId !== undefined) {

      data.billingAddress = dto.billingAddressId.trim()
        ? {
          connect: {
            id: dto.billingAddressId,
          },
        }
        : {
          disconnect: true,
        };

    }

    if (dto.shippingAddressId !== undefined) {

      data.shippingAddress = dto.shippingAddressId.trim()
        ? {
          connect: {
            id: dto.shippingAddressId,
          },
        }
        : {
          disconnect: true,
        };

    }

    return this.db.order.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete an order.
   */
  async deleteOrder(
    id: string,
  ): Promise<Order> {

    return this.db.order.delete({

      where: { id },

    });

  }

  // ========================================================
  // Private Helpers
  // ========================================================

  async generateOrderNumber(
    dbClient?: Prisma.TransactionClient,
  ): Promise<string> {

    const client = dbClient ?? this.defaultDbClient;

    const latestOrder = await client.order.findFirst({

      select: {
        orderNumber: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

    });

    const latestSequence = latestOrder
      ? Number.parseInt(
        latestOrder.orderNumber.replace('ORD-', ''),
        10,
      )
      : 0;

    const nextSequence = Number.isNaN(latestSequence)
      ? 1
      : latestSequence + 1;

    return `ORD-${nextSequence.toString().padStart(6, '0')}`;

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const orderService = new OrderService();
