"use strict";
// ==========================================================
// Cart Item Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateCartItem = validateCreateCartItem;
exports.validateUpdateCartItem = validateUpdateCartItem;
function validateCreateCartItem(dto) {
    if (!dto.cartId?.trim()) {
        throw new Error('Cart id is required.');
    }
    if (!dto.productVariantId?.trim()) {
        throw new Error('Product variant id is required.');
    }
    if (dto.quantity === undefined) {
        throw new Error('Quantity is required.');
    }
    if (dto.quantity <= 0) {
        throw new Error('Quantity must be greater than zero.');
    }
}
function validateUpdateCartItem(dto) {
    if (dto.quantity !== undefined &&
        dto.quantity <= 0) {
        throw new Error('Quantity must be greater than zero.');
    }
}
