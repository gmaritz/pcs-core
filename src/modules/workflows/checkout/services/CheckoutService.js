"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutService = exports.CheckoutService = exports.CheckoutServiceError = void 0;
const client_1 = require("@prisma/client");
const BaseService_1 = require("../../../shared/services/BaseService");
const services_1 = require("../../../orders/services");
const services_2 = require("../../../payments/services");
// ==========================================================
// Errors
// ==========================================================
class CheckoutServiceError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'CheckoutServiceError';
        this.statusCode = statusCode;
    }
}
exports.CheckoutServiceError = CheckoutServiceError;
// ==========================================================
// Checkout Service
// ==========================================================
class CheckoutService extends BaseService_1.BaseService {
    async checkout(dto) {
        return this.db.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: {
                    id: dto.cartId,
                },
                include: {
                    customer: true,
                    items: {
                        include: {
                            productVariant: {
                                include: {
                                    inventory: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!cart) {
                throw new CheckoutServiceError('Cart not found.', 404);
            }
            if (cart.status !== client_1.CartStatus.ACTIVE) {
                throw new CheckoutServiceError('Cart must be ACTIVE.', 400);
            }
            if (cart.items.length === 0) {
                throw new CheckoutServiceError('Cart is empty.', 400);
            }
            for (const item of cart.items) {
                const inventories = item.productVariant.inventory;
                const availableQuantity = inventories.reduce((total, inventory) => total + (inventory.quantityOnHand -
                    inventory.quantityReserved), 0);
                if (availableQuantity < item.quantity) {
                    throw new CheckoutServiceError('Insufficient inventory.', 409);
                }
            }
            const order = await services_1.orderService.createOrder({
                customerId: cart.customerId,
                billingAddressId: dto.billingAddressId,
                shippingAddressId: dto.shippingAddressId,
                notes: dto.notes,
            }, tx);
            const items = await Promise.all(cart.items.map((item) => tx.orderItem.create({
                data: {
                    orderId: order.id,
                    productVariantId: item.productVariantId,
                    quantity: item.quantity,
                    unitPrice: new client_1.Prisma.Decimal(0),
                    totalPrice: new client_1.Prisma.Decimal(0),
                },
            })));
            const payment = await services_2.paymentService.createPayment({
                orderId: order.id,
                amount: 0,
                method: client_1.PaymentChannel.EFT,
                notes: 'Pending payment created by checkout workflow.',
            }, tx);
            await tx.cart.update({
                where: {
                    id: cart.id,
                },
                data: {
                    status: client_1.CartStatus.CHECKED_OUT,
                },
            });
            return {
                order,
                items,
                payment,
            };
        });
    }
}
exports.CheckoutService = CheckoutService;
// ==========================================================
// Service Instance
// ==========================================================
exports.checkoutService = new CheckoutService();
