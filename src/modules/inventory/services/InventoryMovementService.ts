// ==========================================================
// Imports
// ==========================================================

import { InventoryMovement, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

import {
  CreateInventoryMovementDto,
  UpdateInventoryMovementDto,
} from '../types/inventory-movement.dto';

// ==========================================================
// Inventory Movement Service
// ==========================================================

export class InventoryMovementService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single inventory movement by its unique identifier.
   */
  async getInventoryMovement(
    id: string,
  ): Promise<InventoryMovement | null> {

    return this.db.inventoryMovement.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve inventory movements.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getInventoryMovements(
    options?: Prisma.InventoryMovementFindManyArgs,
  ): Promise<InventoryMovement[]> {

    return this.db.inventoryMovement.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new inventory movement.
   */
  async createInventoryMovement(
    dto: CreateInventoryMovementDto,
  ): Promise<InventoryMovement> {

    const data: Prisma.InventoryMovementCreateInput = {

      movementType: dto.movementType,

      quantity: dto.quantity,

      reason: dto.reason,

      reference: dto.reference,

      inventory: {
        connect: {
          id: dto.inventoryId,
        },
      },

    };

    return this.db.inventoryMovement.create({

      data,

    });

  }

  /**
   * Update an existing inventory movement.
   */
  async updateInventoryMovement(
    id: string,
    dto: UpdateInventoryMovementDto,
  ): Promise<InventoryMovement> {

    const data: Prisma.InventoryMovementUpdateInput = {};

    if (dto.movementType !== undefined) {
      data.movementType = dto.movementType;
    }

    if (dto.quantity !== undefined) {
      data.quantity = dto.quantity;
    }

    if (dto.reason !== undefined) {
      data.reason = dto.reason;
    }

    if (dto.reference !== undefined) {
      data.reference = dto.reference;
    }

    return this.db.inventoryMovement.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete an inventory movement.
   */
  async deleteInventoryMovement(
    id: string,
  ): Promise<InventoryMovement> {

    return this.db.inventoryMovement.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const inventoryMovementService =
  new InventoryMovementService();