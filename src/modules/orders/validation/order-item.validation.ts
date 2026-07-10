// ==========================================================
// Order Item Validation
// ==========================================================

import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from '../types/order-item.dto';

export function validateCreateOrderItem(
  dto: CreateOrderItemDto,
): void {

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

  if (
    dto.unitPrice !== undefined &&
    dto.unitPrice < 0
  ) {
    throw new Error('Unit price must be zero or greater.');
  }

  if (
    dto.totalPrice !== undefined &&
    dto.totalPrice < 0
  ) {
    throw new Error('Total price must be zero or greater.');
  }

}

export function validateUpdateOrderItem(
  dto: UpdateOrderItemDto,
): void {

  if (
    dto.quantity !== undefined &&
    dto.quantity <= 0
  ) {
    throw new Error('Quantity must be greater than zero.');
  }

  if (
    dto.unitPrice !== undefined &&
    dto.unitPrice < 0
  ) {
    throw new Error('Unit price must be zero or greater.');
  }

  if (
    dto.totalPrice !== undefined &&
    dto.totalPrice < 0
  ) {
    throw new Error('Total price must be zero or greater.');
  }

}
