// ==========================================================
// Cart Item Validation
// ==========================================================

import {
  CreateCartItemDto,
  UpdateCartItemDto,
} from '../types/cart-item.dto';

export function validateCreateCartItem(
  dto: CreateCartItemDto,
): void {

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

export function validateUpdateCartItem(
  dto: UpdateCartItemDto,
): void {

  if (
    dto.quantity !== undefined &&
    dto.quantity <= 0
  ) {
    throw new Error('Quantity must be greater than zero.');
  }

}
