// ==========================================================
// Imports
// ==========================================================

import {
  Inventory,
  InventoryMovement,
  InventoryMovementType,
  OrderStatus,
} from '@prisma/client';

import { BaseService } from '../../../shared/services/BaseService';

import {
  ProcessOrderDto,
  ProcessOrderResultDto,
} from '../types';

// ==========================================================
// Errors
// ==========================================================

export class OrderProcessingServiceError extends Error {

  readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
  ) {

    super(message);

    this.name = 'OrderProcessingServiceError';

    this.statusCode = statusCode;

  }

}

// ==========================================================
// Order Processing Service
// ==========================================================

export class OrderProcessingService extends BaseService {

  async processOrder(
    dto: ProcessOrderDto,
  ): Promise<ProcessOrderResultDto> {

    return this.db.$transaction(async (tx) => {

      const order = await tx.order.findUnique({

        where: {
          id: dto.orderId,
        },

        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  inventory: {
                    include: {
                      warehouse: true,
                    },
                  },
                },
              },
            },
          },
        },

      });

      if (!order) {
        throw new OrderProcessingServiceError('Order not found.', 404);
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new OrderProcessingServiceError('Order already processed.', 400);
      }

      const updatedInventoryRecords: Inventory[] = [];
      const inventoryMovements: InventoryMovement[] = [];
      const forceFailureAfterFirstMovement =
        process.env.WF004_FORCE_EXCEPTION_AFTER_FIRST_MOVEMENT === 'true';

      for (const item of order.items) {

        const inventory = item.productVariant.inventory[0];

        if (!inventory) {
          throw new OrderProcessingServiceError('Inventory unavailable.', 409);
        }

        const availableQuantity =
          inventory.quantityOnHand -
          inventory.quantityReserved;

        if (availableQuantity < item.quantity) {
          throw new OrderProcessingServiceError('Inventory unavailable.', 409);
        }

        const updatedInventory = await tx.inventory.update({

          where: {
            id: inventory.id,
          },

          data: {
            quantityReserved: {
              increment: item.quantity,
            },
          },

        });

        updatedInventoryRecords.push(updatedInventory);

        const movement = await tx.inventoryMovement.create({

          data: {
            inventoryId: inventory.id,
            movementType: InventoryMovementType.RESERVED,
            quantity: item.quantity,
            reason: 'RESERVED',
            reference: `ORDER:${order.id}`,
          },

        });

        inventoryMovements.push(movement);

        if (
          forceFailureAfterFirstMovement &&
          inventoryMovements.length === 1
        ) {
          throw new OrderProcessingServiceError(
            'Forced WF-004 rollback verification failure.',
            500,
          );
        }

      }

      const updatedOrder = await tx.order.update({

        where: {
          id: order.id,
        },

        data: {
          status: OrderStatus.PROCESSING,
        },

      });

      return {
        order: updatedOrder,
        inventoryMovements,
        inventory: updatedInventoryRecords,
      };

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const orderProcessingService =
  new OrderProcessingService();
