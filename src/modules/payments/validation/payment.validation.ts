// ==========================================================
// Payment Validation
// ==========================================================

import {
  PaymentChannel,
  PaymentStatus,
} from '@prisma/client';

import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from '../types/payment.dto';

const PAYMENT_METHODS: PaymentChannel[] = [
  'EFT',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'CASH',
  'PAYFAST',
  'PAYGATE',
  'YOCO',
  'OZOW',
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  'PENDING',
  'AUTHORIZED',
  'PAID',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
];

function isValidPaymentMethod(
  method: string,
): method is PaymentChannel {

  return PAYMENT_METHODS.includes(
    method as PaymentChannel,
  );

}

function isValidPaymentStatus(
  status: string,
): status is PaymentStatus {

  return PAYMENT_STATUSES.includes(
    status as PaymentStatus,
  );

}

export function validateCreatePayment(
  dto: CreatePaymentDto,
): void {

  if (!dto.orderId?.trim()) {
    throw new Error('Order id is required.');
  }

  if (dto.amount === undefined) {
    throw new Error('Amount is required.');
  }

  if (dto.amount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }

  if (!dto.method) {
    throw new Error('Payment method is required.');
  }

  if (!isValidPaymentMethod(dto.method)) {
    throw new Error(
      'Payment method is invalid.',
    );
  }

  if (
    dto.currency !== undefined &&
    !dto.currency.trim()
  ) {
    throw new Error('Currency is required if supplied.');
  }

}

export function validateUpdatePayment(
  dto: UpdatePaymentDto,
): void {

  if (
    dto.status !== undefined &&
    !isValidPaymentStatus(dto.status)
  ) {
    throw new Error('Payment status is invalid.');
  }

}
