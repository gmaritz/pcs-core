"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderProcessingService = exports.OrderProcessingService = exports.OrderProcessingServiceError = void 0;
const client_1 = require("@prisma/client");
const BaseService_1 = require("../../../shared/services/BaseService");
// ==========================================================
// Errors
// ==========================================================
class OrderProcessingServiceError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'OrderProcessingServiceError';
        this.statusCode = statusCode;
    }
}
exports.OrderProcessingServiceError = OrderProcessingServiceError;
// ==========================================================
// Order Processing Service
// ==========================================================
class OrderProcessingService extends BaseService_1.BaseService {
    async processOrder(dto) {
        return this.db.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: {
                    id: dto.orderId,
                },
                include: {
                    items: {
                        include: {
                            productVariant: {
                                include: {
                                    inventory: {
                                        include: {
                                            warehouse: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!order) {
                throw new OrderProcessingServiceError('Order not found.', 404);
            }
            if (order.status !== client_1.OrderStatus.PENDING) {
                throw new OrderProcessingServiceError('Order already processed.', 400);
            }
            const updatedInventoryRecords = [];
            const inventoryMovements = [];
            const forceFailureAfterFirstMovement = process.env.WF004_FORCE_EXCEPTION_AFTER_FIRST_MOVEMENT === 'true';
            for (const item of order.items) {
                const inventory = item.productVariant.inventory[0];
                if (!inventory) {
                    throw new OrderProcessingServiceError('Inventory unavailable.', 409);
                }
                const availableQuantity = inventory.quantityOnHand -
                    inventory.quantityReserved;
                if (availableQuantity < item.quantity) {
                    throw new OrderProcessingServiceError('Inventory unavailable.', 409);
                }
                const updatedInventory = await tx.inventory.update({
                    where: {
                        id: inventory.id,
                    },
                    data: {
                        quantityReserved: {
                            increment: item.quantity,
                        },
                    },
                });
                updatedInventoryRecords.push(updatedInventory);
                const movement = await tx.inventoryMovement.create({
                    data: {
                        inventoryId: inventory.id,
                        movementType: client_1.InventoryMovementType.RESERVED,
                        quantity: item.quantity,
                        reason: 'RESERVED',
                        reference: `ORDER:${order.id}`,
                    },
                });
                inventoryMovements.push(movement);
                if (forceFailureAfterFirstMovement &&
                    inventoryMovements.length === 1) {
                    throw new OrderProcessingServiceError('Forced WF-004 rollback verification failure.', 500);
                }
            }
            const updatedOrder = await tx.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    status: client_1.OrderStatus.PROCESSING,
                },
            });
            return {
                order: updatedOrder,
                inventoryMovements,
                inventory: updatedInventoryRecords,
            };
        });
    }
}
exports.OrderProcessingService = OrderProcessingService;
// ==========================================================
// Service Instance
// ==========================================================
exports.orderProcessingService = new OrderProcessingService();
