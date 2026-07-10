"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = exports.CartController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const cart_validation_1 = require("../validation/cart.validation");
// ==========================================================
// Cart Controller
// ==========================================================
class CartController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all carts.
     */
    async getCarts(_req, res) {
        const carts = await services_1.cartService.getCarts();
        responses_1.ApiResponse.success(res, carts);
    }
    /**
     * Retrieve a single cart.
     */
    async getCart(req, res) {
        const cart = await services_1.cartService.getCart(req.params.id);
        if (!cart) {
            responses_1.ApiResponse.notFound(res, 'Cart not found.');
            return;
        }
        responses_1.ApiResponse.success(res, cart);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createCart(req, res) {
        (0, cart_validation_1.validateCreateCart)(req.body);
        const cart = await services_1.cartService.createCart(req.body);
        responses_1.ApiResponse.created(res, cart);
    }
    async updateCart(req, res) {
        (0, cart_validation_1.validateUpdateCart)(req.body);
        const cart = await services_1.cartService.updateCart(req.params.id, req.body);
        responses_1.ApiResponse.success(res, cart);
    }
    async deleteCart(req, res) {
        await services_1.cartService.deleteCart(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.CartController = CartController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.cartController = new CartController();
