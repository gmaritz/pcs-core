"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSearchWorkflowController = exports.ProductSearchWorkflowController = void 0;
const responses_1 = require("../../../shared/responses");
const services_1 = require("../services");
const validation_1 = require("../validation");
// ==========================================================
// Product Search Workflow Controller
// ==========================================================
class ProductSearchWorkflowController {
    async search(req, res) {
        try {
            const query = (0, validation_1.validateProductSearchQuery)(req.query);
            const result = await services_1.productSearchWorkflowService.search(query);
            responses_1.ApiResponse.success(res, result);
        }
        catch (error) {
            if (error instanceof validation_1.ProductSearchValidationError) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            throw error;
        }
    }
}
exports.ProductSearchWorkflowController = ProductSearchWorkflowController;
exports.productSearchWorkflowController = new ProductSearchWorkflowController();
