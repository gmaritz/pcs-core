// ==========================================================
// Checkout Validation
// ==========================================================

import {
  CheckoutDto,
} from '../types';

export class CheckoutValidationError extends Error {

  constructor(message: string) {

    super(message);

    this.name = 'CheckoutValidationError';

  }

}

export function validateCheckout(
  dto: CheckoutDto,
): void {

  if (!dto.cartId?.trim()) {
    throw new CheckoutValidationError('Cart id is required.');
  }

  if (
    dto.billingAddressId !== undefined &&
    !dto.billingAddressId.trim()
  ) {
    throw new CheckoutValidationError('Billing address id must not be empty when provided.');
  }

  if (
    dto.shippingAddressId !== undefined &&
    !dto.shippingAddressId.trim()
  ) {
    throw new CheckoutValidationError('Shipping address id must not be empty when provided.');
  }

}
