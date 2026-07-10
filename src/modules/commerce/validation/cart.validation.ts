// ==========================================================
// Cart Validation
// ==========================================================

import { CartStatus } from '@prisma/client';

import {
  CreateCartDto,
  UpdateCartDto,
} from '../types/cart.dto';

const CART_STATUSES: CartStatus[] = [
  'ACTIVE',
  'CHECKED_OUT',
  'ABANDONED',
];

function isValidCartStatus(
  status: string,
): status is CartStatus {

  return CART_STATUSES.includes(
    status as CartStatus,
  );

}

export function validateCreateCart(
  dto: CreateCartDto,
): void {

  if (!dto.customerId?.trim()) {
    throw new Error('Customer id is required.');
  }

}

export function validateUpdateCart(
  dto: UpdateCartDto,
): void {

  if (
    dto.status !== undefined &&
    !isValidCartStatus(dto.status)
  ) {
    throw new Error(
      'Cart status must be ACTIVE, CHECKED_OUT, or ABANDONED.',
    );
  }

}
