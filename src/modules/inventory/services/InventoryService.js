"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = exports.InventoryService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Inventory Service
// ==========================================================
class InventoryService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single inventory record by its unique identifier.
     */
    async getInventory(id) {
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
    async getInventories(options) {
        return this.db.inventory.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new inventory record.
     */
    async createInventory(dto) {
        const data = {
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
    async updateInventory(id, dto) {
        const data = {};
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
    async deleteInventory(id) {
        return this.db.inventory.delete({
            where: { id },
        });
    }
}
exports.InventoryService = InventoryService;
// ==========================================================
// Service Instance
// ==========================================================
exports.inventoryService = new InventoryService();
