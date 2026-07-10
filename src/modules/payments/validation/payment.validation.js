"use strict";
// ==========================================================
// Payment Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreatePayment = validateCreatePayment;
exports.validateUpdatePayment = validateUpdatePayment;
const PAYMENT_METHODS = [
    'EFT',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'CASH',
    'PAYFAST',
    'PAYGATE',
    'YOCO',
    'OZOW',
];
const PAYMENT_STATUSES = [
    'PENDING',
    'AUTHORIZED',
    'PAID',
    'FAILED',
    'CANCELLED',
    'REFUNDED',
];
function isValidPaymentMethod(method) {
    return PAYMENT_METHODS.includes(method);
}
function isValidPaymentStatus(status) {
    return PAYMENT_STATUSES.includes(status);
}
function validateCreatePayment(dto) {
    if (!dto.orderId?.trim()) {
        throw new Error('Order id is required.');
    }
    if (dto.amount === undefined) {
        throw new Error('Amount is required.');
    }
    if (dto.amount <= 0) {
        throw new Error('Amount must be greater than zero.');
    }
    if (!dto.method) {
        throw new Error('Payment method is required.');
    }
    if (!isValidPaymentMethod(dto.method)) {
        throw new Error('Payment method is invalid.');
    }
    if (dto.currency !== undefined &&
        !dto.currency.trim()) {
        throw new Error('Currency is required if supplied.');
    }
}
function validateUpdatePayment(dto) {
    if (dto.status !== undefined &&
        !isValidPaymentStatus(dto.status)) {
        throw new Error('Payment status is invalid.');
    }
}
