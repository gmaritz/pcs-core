"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierImportController = exports.SupplierImportController = void 0;
const responses_1 = require("../../../shared/responses");
const services_1 = require("../services");
const validation_1 = require("../validation");
// ==========================================================
// Supplier Import Controller
// ==========================================================
class SupplierImportController {
    async importProducts(req, res) {
        try {
            (0, validation_1.validateImportProducts)(req.body);
            const result = await services_1.supplierImportService.importProducts(req.body);
            responses_1.ApiResponse.success(res, result);
        }
        catch (error) {
            if (error instanceof validation_1.SupplierImportValidationError) {
                res.status(400).json({
                    message: error.message,
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
exports.SupplierImportController = SupplierImportController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.supplierImportController = new SupplierImportController();
