// ==========================================================
// Order Validation
// ==========================================================

import { OrderStatus } from '@prisma/client';

import {
  CreateOrderDto,
  UpdateOrderDto,
} from '../types/order.dto';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
];

function isValidOrderStatus(
  status: string,
): status is OrderStatus {

  return ORDER_STATUSES.includes(
    status as OrderStatus,
  );

}

export function validateCreateOrder(
  dto: CreateOrderDto,
): void {

  if (!dto.customerId?.trim()) {
    throw new Error('Customer id is required.');
  }

}

export function validateUpdateOrder(
  dto: UpdateOrderDto,
): void {

  if (
    dto.status !== undefined &&
    !isValidOrderStatus(dto.status)
  ) {
    throw new Error(
      'Order status must be PENDING, CONFIRMED, PROCESSING, SHIPPED, COMPLETED, or CANCELLED.',
    );
  }

}
