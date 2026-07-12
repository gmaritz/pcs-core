// ==========================================================
// Checkout DTOs
// ==========================================================

import {
  Order,
  OrderItem,
  Payment,
} from '@prisma/client';

export interface CheckoutDto {

  cartId: string;

  billingAddressId?: string;

  shippingAddressId?: string;

  notes?: string;

}

export interface CheckoutResultDto {

  order: Order;

  items: OrderItem[];

  payment: Payment;

}
