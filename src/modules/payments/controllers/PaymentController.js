"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.PaymentController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const payment_validation_1 = require("../validation/payment.validation");
// ==========================================================
// Payment Controller
// ==========================================================
class PaymentController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all payments.
     */
    async getPayments(_req, res) {
        const payments = await services_1.paymentService.getPayments();
        responses_1.ApiResponse.success(res, payments);
    }
    /**
     * Retrieve a single payment.
     */
    async getPayment(req, res) {
        const payment = await services_1.paymentService.getPayment(req.params.id);
        if (!payment) {
            responses_1.ApiResponse.notFound(res, 'Payment not found.');
            return;
        }
        responses_1.ApiResponse.success(res, payment);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createPayment(req, res) {
        (0, payment_validation_1.validateCreatePayment)(req.body);
        const payment = await services_1.paymentService.createPayment(req.body);
        responses_1.ApiResponse.created(res, payment);
    }
    async updatePayment(req, res) {
        (0, payment_validation_1.validateUpdatePayment)(req.body);
        const payment = await services_1.paymentService.updatePayment(req.params.id, req.body);
        responses_1.ApiResponse.success(res, payment);
    }
    async deletePayment(req, res) {
        await services_1.paymentService.deletePayment(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.PaymentController = PaymentController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.paymentController = new PaymentController();
