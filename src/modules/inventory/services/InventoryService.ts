// ==========================================================
// Imports
// ==========================================================

import { Inventory, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  CreateInventoryDto,
  UpdateInventoryDto,
} from '../types/inventory.dto';

// ==========================================================
// Inventory Service
// ==========================================================

export class InventoryService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single inventory record by its unique identifier.
   */
  async getInventory(
    id: string,
  ): Promise<Inventory | null> {

    return this.db.inventory.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve inventory records.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getInventories(
    options?: Prisma.InventoryFindManyArgs,
  ): Promise<Inventory[]> {

    return this.db.inventory.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new inventory record.
   */
  async createInventory(
    dto: CreateInventoryDto,
  ): Promise<Inventory> {

    const data: Prisma.InventoryCreateInput = {

      quantityOnHand: dto.quantityOnHand,

      reorderLevel: dto.reorderLevel ?? 0,

      productVariant: {
        connect: {
          id: dto.productVariantId,
        },
      },

    };

    return this.db.inventory.create({

      data,

    });

  }

  /**
   * Update an existing inventory record.
   */
  async updateInventory(
    id: string,
    dto: UpdateInventoryDto,
  ): Promise<Inventory> {

    const data: Prisma.InventoryUpdateInput = {};

    if (dto.quantityOnHand !== undefined) {
      data.quantityOnHand = dto.quantityOnHand;
    }

    if (dto.reorderLevel !== undefined) {
      data.reorderLevel = dto.reorderLevel;
    }

    if (dto.productVariantId !== undefined) {

      data.productVariant = {
        connect: {
          id: dto.productVariantId,
        },
      };

    }

    return this.db.inventory.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete an inventory record.
   */
  async deleteInventory(
    id: string,
  ): Promise<Inventory> {

    return this.db.inventory.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const inventoryService = new InventoryService();
