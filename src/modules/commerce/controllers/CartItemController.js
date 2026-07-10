"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemController = exports.CartItemController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const cart_item_validation_1 = require("../validation/cart-item.validation");
// ==========================================================
// Cart Item Controller
// ==========================================================
class CartItemController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all cart items.
     */
    async getCartItems(_req, res) {
        const cartItems = await services_1.cartItemService.getCartItems();
        responses_1.ApiResponse.success(res, cartItems);
    }
    /**
     * Retrieve a single cart item.
     */
    async getCartItem(req, res) {
        const cartItem = await services_1.cartItemService.getCartItem(req.params.id);
        if (!cartItem) {
            responses_1.ApiResponse.notFound(res, 'Cart Item not found.');
            return;
        }
        responses_1.ApiResponse.success(res, cartItem);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createCartItem(req, res) {
        (0, cart_item_validation_1.validateCreateCartItem)(req.body);
        const cartItem = await services_1.cartItemService.createCartItem(req.body);
        responses_1.ApiResponse.created(res, cartItem);
    }
    async updateCartItem(req, res) {
        (0, cart_item_validation_1.validateUpdateCartItem)(req.body);
        const cartItem = await services_1.cartItemService.updateCartItem(req.params.id, req.body);
        responses_1.ApiResponse.success(res, cartItem);
    }
    async deleteCartItem(req, res) {
        await services_1.cartItemService.deleteCartItem(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.CartItemController = CartItemController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.cartItemController = new CartItemController();
