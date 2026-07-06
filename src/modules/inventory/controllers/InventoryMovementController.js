"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryMovementController = exports.InventoryMovementController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const inventory_movement_validation_1 = require("../validation/inventory-movement.validation");
// ==========================================================
// Inventory Movement Controller
// ==========================================================
class InventoryMovementController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all inventory movements.
     */
    async getInventoryMovements(_req, res) {
        const inventoryMovements = await services_1.inventoryMovementService.getInventoryMovements();
        responses_1.ApiResponse.success(res, inventoryMovements);
    }
    /**
     * Retrieve a single inventory movement.
     */
    async getInventoryMovement(req, res) {
        const inventoryMovement = await services_1.inventoryMovementService.getInventoryMovement(req.params.id);
        if (!inventoryMovement) {
            responses_1.ApiResponse.notFound(res, 'Inventory Movement not found.');
            return;
        }
        responses_1.ApiResponse.success(res, inventoryMovement);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createInventoryMovement(req, res) {
        (0, inventory_movement_validation_1.validateCreateInventoryMovement)(req.body);
        const inventoryMovement = await services_1.inventoryMovementService.createInventoryMovement(req.body);
        responses_1.ApiResponse.created(res, inventoryMovement);
    }
    async updateInventoryMovement(req, res) {
        (0, inventory_movement_validation_1.validateUpdateInventoryMovement)(req.body);
        const inventoryMovement = await services_1.inventoryMovementService.updateInventoryMovement(req.params.id, req.body);
        responses_1.ApiResponse.success(res, inventoryMovement);
    }
    async deleteInventoryMovement(req, res) {
        await services_1.inventoryMovementService.deleteInventoryMovement(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.InventoryMovementController = InventoryMovementController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.inventoryMovementController = new InventoryMovementController();
