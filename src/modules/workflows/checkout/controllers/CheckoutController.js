"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutController = exports.CheckoutController = void 0;
const responses_1 = require("../../../shared/responses");
const services_1 = require("../services");
const validation_1 = require("../validation");
// ==========================================================
// Checkout Controller
// ==========================================================
class CheckoutController {
    async checkout(req, res) {
        try {
            (0, validation_1.validateCheckout)(req.body);
            const result = await services_1.checkoutService.checkout(req.body);
            responses_1.ApiResponse.created(res, result);
        }
        catch (error) {
            if (error instanceof validation_1.CheckoutValidationError) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            if (error instanceof services_1.CheckoutServiceError) {
                res.status(error.statusCode).json({
                    message: error.message,
                });
                return;
            }
            throw error;
        }
    }
}
exports.CheckoutController = CheckoutController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.checkoutController = new CheckoutController();
