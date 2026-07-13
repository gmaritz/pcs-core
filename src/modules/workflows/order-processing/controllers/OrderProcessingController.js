"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderProcessingController = exports.OrderProcessingController = void 0;
const responses_1 = require("../../../shared/responses");
const services_1 = require("../services");
const validation_1 = require("../validation");
// ==========================================================
// Order Processing Controller
// ==========================================================
class OrderProcessingController {
    async processOrder(req, res) {
        try {
            (0, validation_1.validateProcessOrder)(req.body);
            const result = await services_1.orderProcessingService.processOrder(req.body);
            responses_1.ApiResponse.success(res, result);
        }
        catch (error) {
            if (error instanceof validation_1.OrderProcessingValidationError) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            if (error instanceof services_1.OrderProcessingServiceError) {
                res.status(error.statusCode).json({
                    message: error.message,
                });
                return;
            }
            throw error;
        }
    }
}
exports.OrderProcessingController = OrderProcessingController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.orderProcessingController = new OrderProcessingController();
