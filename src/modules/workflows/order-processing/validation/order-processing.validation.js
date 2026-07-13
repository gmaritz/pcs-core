"use strict";
// ==========================================================
// Order Processing Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProcessingValidationError = void 0;
exports.validateProcessOrder = validateProcessOrder;
class OrderProcessingValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OrderProcessingValidationError';
    }
}
exports.OrderProcessingValidationError = OrderProcessingValidationError;
function validateProcessOrder(dto) {
    if (!dto.orderId?.trim()) {
        throw new OrderProcessingValidationError('Order id is required.');
    }
}
