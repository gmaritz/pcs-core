"use strict";
// ==========================================================
// Cart Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateCart = validateCreateCart;
exports.validateUpdateCart = validateUpdateCart;
const CART_STATUSES = [
    'ACTIVE',
    'CHECKED_OUT',
    'ABANDONED',
];
function isValidCartStatus(status) {
    return CART_STATUSES.includes(status);
}
function validateCreateCart(dto) {
    if (!dto.customerId?.trim()) {
        throw new Error('Customer id is required.');
    }
}
function validateUpdateCart(dto) {
    if (dto.status !== undefined &&
        !isValidCartStatus(dto.status)) {
        throw new Error('Cart status must be ACTIVE, CHECKED_OUT, or ABANDONED.');
    }
}
