"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventorySyncController = exports.InventorySyncController = void 0;
const responses_1 = require("../../../shared/responses");
const services_1 = require("../services");
const validation_1 = require("../validation");
// ==========================================================
// Inventory Sync Controller
// ==========================================================
class InventorySyncController {
    async synchronise(req, res) {
        try {
            (0, validation_1.validateSynchroniseInventory)(req.body);
            const result = await services_1.inventorySyncService.synchronise(req.body);
            responses_1.ApiResponse.success(res, result);
        }
        catch (error) {
            if (error instanceof validation_1.InventorySyncValidationError) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            if (error instanceof services_1.InventorySyncServiceError) {
                res.status(error.statusCode).json({
                    message: error.message,
                });
                return;
            }
            throw error;
        }
    }
}
exports.InventorySyncController = InventorySyncController;
exports.inventorySyncController = new InventorySyncController();
