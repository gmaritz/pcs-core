"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemService = exports.OrderItemService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Order Item Service
// ==========================================================
class OrderItemService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single order item by its unique identifier.
     */
    async getOrderItem(id) {
        return this.db.orderItem.findUnique({
            where: { id },
        });
    }
    /**
   * Retrieve order items.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getOrderItems(options) {
        return this.db.orderItem.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new order item.
     */
    async createOrderItem(dto) {
        const data = {
            quantity: dto.quantity,
            unitPrice: dto.unitPrice,
            totalPrice: dto.totalPrice,
            order: {
                connect: {
                    id: dto.orderId,
                },
            },
            productVariant: {
                connect: {
                    id: dto.productVariantId,
                },
            },
        };
        return this.db.orderItem.create({
            data,
        });
    }
    /**
     * Update an existing order item.
     */
    async updateOrderItem(id, dto) {
        const data = {};
        if (dto.quantity !== undefined) {
            data.quantity = dto.quantity;
        }
        if (dto.unitPrice !== undefined) {
            data.unitPrice = dto.unitPrice;
        }
        if (dto.totalPrice !== undefined) {
            data.totalPrice = dto.totalPrice;
        }
        return this.db.orderItem.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete an order item.
     */
    async deleteOrderItem(id) {
        return this.db.orderItem.delete({
            where: { id },
        });
    }
}
exports.OrderItemService = OrderItemService;
// ==========================================================
// Service Instance
// ==========================================================
exports.orderItemService = new OrderItemService();
