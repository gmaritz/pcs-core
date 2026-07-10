"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemController = exports.OrderItemController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const order_item_validation_1 = require("../validation/order-item.validation");
// ==========================================================
// Order Item Controller
// ==========================================================
class OrderItemController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all order items.
     */
    async getOrderItems(_req, res) {
        const orderItems = await services_1.orderItemService.getOrderItems();
        responses_1.ApiResponse.success(res, orderItems);
    }
    /**
     * Retrieve a single order item.
     */
    async getOrderItem(req, res) {
        const orderItem = await services_1.orderItemService.getOrderItem(req.params.id);
        if (!orderItem) {
            responses_1.ApiResponse.notFound(res, 'Order Item not found.');
            return;
        }
        responses_1.ApiResponse.success(res, orderItem);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createOrderItem(req, res) {
        (0, order_item_validation_1.validateCreateOrderItem)(req.body);
        const orderItem = await services_1.orderItemService.createOrderItem(req.body);
        responses_1.ApiResponse.created(res, orderItem);
    }
    async updateOrderItem(req, res) {
        (0, order_item_validation_1.validateUpdateOrderItem)(req.body);
        const orderItem = await services_1.orderItemService.updateOrderItem(req.params.id, req.body);
        responses_1.ApiResponse.success(res, orderItem);
    }
    async deleteOrderItem(req, res) {
        await services_1.orderItemService.deleteOrderItem(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.OrderItemController = OrderItemController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.orderItemController = new OrderItemController();
