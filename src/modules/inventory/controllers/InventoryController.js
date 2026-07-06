"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryController = exports.InventoryController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const inventory_validation_1 = require("../validation/inventory.validation");
// ==========================================================
// Inventory Controller
// ==========================================================
class InventoryController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all inventory records.
     */
    async getInventories(_req, res) {
        const inventories = await services_1.inventoryService.getInventories();
        responses_1.ApiResponse.success(res, inventories);
    }
    /**
     * Retrieve a single inventory record.
     */
    async getInventory(req, res) {
        const inventory = await services_1.inventoryService.getInventory(req.params.id);
        if (!inventory) {
            responses_1.ApiResponse.notFound(res, 'Inventory not found.');
            return;
        }
        responses_1.ApiResponse.success(res, inventory);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createInventory(req, res) {
        (0, inventory_validation_1.validateCreateInventory)(req.body);
        const inventory = await services_1.inventoryService.createInventory(req.body);
        responses_1.ApiResponse.created(res, inventory);
    }
    async updateInventory(req, res) {
        (0, inventory_validation_1.validateUpdateInventory)(req.body);
        const inventory = await services_1.inventoryService.updateInventory(req.params.id, req.body);
        responses_1.ApiResponse.success(res, inventory);
    }
    async deleteInventory(req, res) {
        await services_1.inventoryService.deleteInventory(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.InventoryController = InventoryController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.inventoryController = new InventoryController();
