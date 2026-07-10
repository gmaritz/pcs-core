"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemService = exports.CartItemService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Cart Item Service
// ==========================================================
class CartItemService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single cart item by its unique identifier.
     */
    async getCartItem(id) {
        return this.db.cartItem.findUnique({
            where: { id },
        });
    }
    /**
   * Retrieve cart items.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getCartItems(options) {
        return this.db.cartItem.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new cart item.
     */
    async createCartItem(dto) {
        const data = {
            quantity: dto.quantity,
            cart: {
                connect: {
                    id: dto.cartId,
                },
            },
            productVariant: {
                connect: {
                    id: dto.productVariantId,
                },
            },
        };
        return this.db.cartItem.create({
            data,
        });
    }
    /**
     * Update an existing cart item.
     */
    async updateCartItem(id, dto) {
        const data = {};
        if (dto.quantity !== undefined) {
            data.quantity = dto.quantity;
        }
        return this.db.cartItem.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a cart item.
     */
    async deleteCartItem(id) {
        return this.db.cartItem.delete({
            where: { id },
        });
    }
}
exports.CartItemService = CartItemService;
// ==========================================================
// Service Instance
// ==========================================================
exports.cartItemService = new CartItemService();
