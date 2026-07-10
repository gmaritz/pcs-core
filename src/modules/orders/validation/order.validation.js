"use strict";
// ==========================================================
// Order Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateOrder = validateCreateOrder;
exports.validateUpdateOrder = validateUpdateOrder;
const ORDER_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED',
];
function isValidOrderStatus(status) {
    return ORDER_STATUSES.includes(status);
}
function validateCreateOrder(dto) {
    if (!dto.customerId?.trim()) {
        throw new Error('Customer id is required.');
    }
}
function validateUpdateOrder(dto) {
    if (dto.status !== undefined &&
        !isValidOrderStatus(dto.status)) {
        throw new Error('Order status must be PENDING, CONFIRMED, PROCESSING, SHIPPED, COMPLETED, or CANCELLED.');
    }
}
