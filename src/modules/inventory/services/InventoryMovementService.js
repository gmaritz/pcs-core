"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryMovementService = exports.InventoryMovementService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Inventory Movement Service
// ==========================================================
class InventoryMovementService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single inventory movement by its unique identifier.
     */
    async getInventoryMovement(id) {
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
    async getInventoryMovements(options) {
        return this.db.inventoryMovement.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new inventory movement.
     */
    async createInventoryMovement(dto) {
        const data = {
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
    async updateInventoryMovement(id, dto) {
        const data = {};
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
    async deleteInventoryMovement(id) {
        return this.db.inventoryMovement.delete({
            where: { id },
        });
    }
}
exports.InventoryMovementService = InventoryMovementService;
// ==========================================================
// Service Instance
// ==========================================================
exports.inventoryMovementService = new InventoryMovementService();
