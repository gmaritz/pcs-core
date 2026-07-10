// ==========================================================
// Payment DTOs
// ==========================================================

import {
  PaymentChannel,
  PaymentStatus,
} from '@prisma/client';

/**
 * Request payload for creating a payment.
 */
export interface CreatePaymentDto {

  orderId: string;

  amount: number;

  currency?: string;

  method: PaymentChannel;

  transactionReference?: string;

  notes?: string;

}

/**
 * Request payload for updating a payment.
 */
export interface UpdatePaymentDto {

  status?: PaymentStatus;

  transactionReference?: string;

  notes?: string;

}
