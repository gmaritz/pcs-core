"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierAdapterController = exports.SupplierAdapterController = void 0;
const responses_1 = require("../../../shared/responses");
const services_1 = require("../../supplier-feed-import/services");
const services_2 = require("../services");
const validation_1 = require("../validation");
// ==========================================================
// Supplier Adapter Controller
// ==========================================================
class SupplierAdapterController {
    async importJson(req, res) {
        try {
            (0, validation_1.validateImportJson)(req.body);
            const result = await services_2.supplierAdapterService.importJson(req.body);
            responses_1.ApiResponse.success(res, result);
        }
        catch (error) {
            if (error instanceof validation_1.SupplierAdapterValidationError) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            if (error instanceof services_2.SupplierAdapterServiceError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    errors: error.errors,
                });
                return;
            }
            if (error instanceof services_1.SupplierImportServiceError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    errors: error.errors,
                });
                return;
            }
            throw error;
        }
    }
}
exports.SupplierAdapterController = SupplierAdapterController;
exports.supplierAdapterController = new SupplierAdapterController();
