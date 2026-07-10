"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = exports.OrderController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const order_validation_1 = require("../validation/order.validation");
// ==========================================================
// Order Controller
// ==========================================================
class OrderController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all orders.
     */
    async getOrders(_req, res) {
        const orders = await services_1.orderService.getOrders();
        responses_1.ApiResponse.success(res, orders);
    }
    /**
     * Retrieve a single order.
     */
    async getOrder(req, res) {
        const order = await services_1.orderService.getOrder(req.params.id);
        if (!order) {
            responses_1.ApiResponse.notFound(res, 'Order not found.');
            return;
        }
        responses_1.ApiResponse.success(res, order);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createOrder(req, res) {
        (0, order_validation_1.validateCreateOrder)(req.body);
        const order = await services_1.orderService.createOrder(req.body);
        responses_1.ApiResponse.created(res, order);
    }
    async updateOrder(req, res) {
        (0, order_validation_1.validateUpdateOrder)(req.body);
        const order = await services_1.orderService.updateOrder(req.params.id, req.body);
        responses_1.ApiResponse.success(res, order);
    }
    async deleteOrder(req, res) {
        await services_1.orderService.deleteOrder(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.OrderController = OrderController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.orderController = new OrderController();
