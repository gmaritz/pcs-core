// ==========================================================
// Imports
// ==========================================================

import { OrderItem, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from '../types/order-item.dto';

// ==========================================================
// Order Item Service
// ==========================================================

export class OrderItemService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single order item by its unique identifier.
   */
  async getOrderItem(
    id: string,
  ): Promise<OrderItem | null> {

    return this.db.orderItem.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve order items.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getOrderItems(
    options?: Prisma.OrderItemFindManyArgs,
  ): Promise<OrderItem[]> {

    return this.db.orderItem.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new order item.
   */
  async createOrderItem(
    dto: CreateOrderItemDto,
  ): Promise<OrderItem> {

    const data: Prisma.OrderItemCreateInput = {

      quantity: dto.quantity,

      unitPrice: dto.unitPrice,

      totalPrice: dto.totalPrice,

      order: {
        connect: {
          id: dto.orderId,
        },
      },

      productVariant: {
        connect: {
          id: dto.productVariantId,
        },
      },

    };

    return this.db.orderItem.create({

      data,

    });

  }

  /**
   * Update an existing order item.
   */
  async updateOrderItem(
    id: string,
    dto: UpdateOrderItemDto,
  ): Promise<OrderItem> {

    const data: Prisma.OrderItemUpdateInput = {};

    if (dto.quantity !== undefined) {
      data.quantity = dto.quantity;
    }

    if (dto.unitPrice !== undefined) {
      data.unitPrice = dto.unitPrice;
    }

    if (dto.totalPrice !== undefined) {
      data.totalPrice = dto.totalPrice;
    }

    return this.db.orderItem.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete an order item.
   */
  async deleteOrderItem(
    id: string,
  ): Promise<OrderItem> {

    return this.db.orderItem.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const orderItemService = new OrderItemService();
