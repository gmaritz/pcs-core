// ==========================================================
// Order DTOs
// ==========================================================

import { OrderStatus } from '@prisma/client';

/**
 * Request payload for creating an order.
 */
export interface CreateOrderDto {

  customerId: string;

  billingAddressId?: string;

  shippingAddressId?: string;

  notes?: string;

}

/**
 * Request payload for updating an order.
 */
export interface UpdateOrderDto {

  status?: OrderStatus;

  billingAddressId?: string;

  shippingAddressId?: string;

  notes?: string;

}
