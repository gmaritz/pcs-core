"use strict";
// ==========================================================
// Checkout Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutValidationError = void 0;
exports.validateCheckout = validateCheckout;
class CheckoutValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CheckoutValidationError';
    }
}
exports.CheckoutValidationError = CheckoutValidationError;
function validateCheckout(dto) {
    if (!dto.cartId?.trim()) {
        throw new CheckoutValidationError('Cart id is required.');
    }
    if (dto.billingAddressId !== undefined &&
        !dto.billingAddressId.trim()) {
        throw new CheckoutValidationError('Billing address id must not be empty when provided.');
    }
    if (dto.shippingAddressId !== undefined &&
        !dto.shippingAddressId.trim()) {
        throw new CheckoutValidationError('Shipping address id must not be empty when provided.');
    }
}
