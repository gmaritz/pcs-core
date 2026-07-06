"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseController = exports.WarehouseController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const warehouse_validation_1 = require("../validation/warehouse.validation");
// ==========================================================
// Warehouse Controller
// ==========================================================
class WarehouseController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all warehouses.
     */
    async getWarehouses(_req, res) {
        const warehouses = await services_1.warehouseService.getWarehouses();
        responses_1.ApiResponse.success(res, warehouses);
    }
    /**
     * Retrieve a single warehouse.
     */
    async getWarehouse(req, res) {
        const warehouse = await services_1.warehouseService.getWarehouse(req.params.id);
        if (!warehouse) {
            responses_1.ApiResponse.notFound(res, 'Warehouse not found.');
            return;
        }
        responses_1.ApiResponse.success(res, warehouse);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createWarehouse(req, res) {
        (0, warehouse_validation_1.validateCreateWarehouse)(req.body);
        const warehouse = await services_1.warehouseService.createWarehouse(req.body);
        responses_1.ApiResponse.created(res, warehouse);
    }
    async updateWarehouse(req, res) {
        (0, warehouse_validation_1.validateUpdateWarehouse)(req.body);
        const warehouse = await services_1.warehouseService.updateWarehouse(req.params.id, req.body);
        responses_1.ApiResponse.success(res, warehouse);
    }
    async deleteWarehouse(req, res) {
        await services_1.warehouseService.deleteWarehouse(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.WarehouseController = WarehouseController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.warehouseController = new WarehouseController();
