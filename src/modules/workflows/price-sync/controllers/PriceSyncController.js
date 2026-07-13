"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceSyncController = exports.PriceSyncController = void 0;
const responses_1 = require("../../../shared/responses");
const services_1 = require("../services");
const validation_1 = require("../validation");
// ==========================================================
// Price Sync Controller
// ==========================================================
class PriceSyncController {
    async synchronise(req, res) {
        try {
            (0, validation_1.validateSynchronisePricing)(req.body);
            const result = await services_1.priceSyncService.synchronise(req.body);
            responses_1.ApiResponse.success(res, result);
        }
        catch (error) {
            if (error instanceof validation_1.PriceSyncValidationError) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            if (error instanceof services_1.PriceSyncServiceError) {
                res.status(error.statusCode).json({
                    message: error.message,
                });
                return;
            }
            throw error;
        }
    }
}
exports.PriceSyncController = PriceSyncController;
exports.priceSyncController = new PriceSyncController();
