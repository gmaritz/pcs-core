"use strict";
// ==========================================================
// Order Item Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateOrderItem = validateCreateOrderItem;
exports.validateUpdateOrderItem = validateUpdateOrderItem;
function validateCreateOrderItem(dto) {
    if (!dto.orderId?.trim()) {
        throw new Error('Order id is required.');
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
    if (dto.unitPrice !== undefined &&
        dto.unitPrice < 0) {
        throw new Error('Unit price must be zero or greater.');
    }
    if (dto.totalPrice !== undefined &&
        dto.totalPrice < 0) {
        throw new Error('Total price must be zero or greater.');
    }
}
function validateUpdateOrderItem(dto) {
    if (dto.quantity !== undefined &&
        dto.quantity <= 0) {
        throw new Error('Quantity must be greater than zero.');
    }
    if (dto.unitPrice !== undefined &&
        dto.unitPrice < 0) {
        throw new Error('Unit price must be zero or greater.');
    }
    if (dto.totalPrice !== undefined &&
        dto.totalPrice < 0) {
        throw new Error('Total price must be zero or greater.');
    }
}
