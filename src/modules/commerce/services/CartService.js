"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = exports.CartService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Cart Service
// ==========================================================
class CartService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single cart by its unique identifier.
     */
    async getCart(id) {
        return this.db.cart.findUnique({
            where: { id },
        });
    }
    /**
   * Retrieve carts.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getCarts(options) {
        return this.db.cart.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new cart.
     */
    async createCart(dto) {
        const data = {
            customer: {
                connect: {
                    id: dto.customerId,
                },
            },
        };
        return this.db.cart.create({
            data,
        });
    }
    /**
     * Update an existing cart.
     */
    async updateCart(id, dto) {
        const data = {};
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        return this.db.cart.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a cart.
     */
    async deleteCart(id) {
        return this.db.cart.delete({
            where: { id },
        });
    }
}
exports.CartService = CartService;
// ==========================================================
// Service Instance
// ==========================================================
exports.cartService = new CartService();
