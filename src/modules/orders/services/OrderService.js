"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Order Service
// ==========================================================
class OrderService extends BaseService_1.BaseService {
    constructor() {
        super(...arguments);
        this.defaultDbClient = this.db;
    }
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single order by its unique identifier.
     */
    async getOrder(id) {
        return this.db.order.findUnique({
            where: { id },
        });
    }
    /**
   * Retrieve orders.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getOrders(options) {
        return this.db.order.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new order.
     */
    async createOrder(dto, dbClient) {
        const client = dbClient ?? this.defaultDbClient;
        const orderNumber = await this.generateOrderNumber(client);
        const data = {
            orderNumber,
            notes: dto.notes,
            customer: {
                connect: {
                    id: dto.customerId,
                },
            },
        };
        if (dto.billingAddressId !== undefined) {
            data.billingAddress = {
                connect: {
                    id: dto.billingAddressId,
                },
            };
        }
        if (dto.shippingAddressId !== undefined) {
            data.shippingAddress = {
                connect: {
                    id: dto.shippingAddressId,
                },
            };
        }
        return client.order.create({
            data,
        });
    }
    /**
     * Update an existing order.
     */
    async updateOrder(id, dto) {
        const data = {};
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        if (dto.notes !== undefined) {
            data.notes = dto.notes;
        }
        if (dto.billingAddressId !== undefined) {
            data.billingAddress = dto.billingAddressId.trim()
                ? {
                    connect: {
                        id: dto.billingAddressId,
                    },
                }
                : {
                    disconnect: true,
                };
        }
        if (dto.shippingAddressId !== undefined) {
            data.shippingAddress = dto.shippingAddressId.trim()
                ? {
                    connect: {
                        id: dto.shippingAddressId,
                    },
                }
                : {
                    disconnect: true,
                };
        }
        return this.db.order.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete an order.
     */
    async deleteOrder(id) {
        return this.db.order.delete({
            where: { id },
        });
    }
    // ========================================================
    // Private Helpers
    // ========================================================
    async generateOrderNumber(dbClient) {
        const client = dbClient ?? this.defaultDbClient;
        const latestOrder = await client.order.findFirst({
            select: {
                orderNumber: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const latestSequence = latestOrder
            ? Number.parseInt(latestOrder.orderNumber.replace('ORD-', ''), 10)
            : 0;
        const nextSequence = Number.isNaN(latestSequence)
            ? 1
            : latestSequence + 1;
        return `ORD-${nextSequence.toString().padStart(6, '0')}`;
    }
}
exports.OrderService = OrderService;
// ==========================================================
// Service Instance
// ==========================================================
exports.orderService = new OrderService();
