// ==========================================================
// Order Processing Validation
// ==========================================================

import {
  ProcessOrderDto,
} from '../types';

export class OrderProcessingValidationError extends Error {

  constructor(message: string) {

    super(message);

    this.name = 'OrderProcessingValidationError';

  }

}

export function validateProcessOrder(
  dto: ProcessOrderDto,
): void {

  if (!dto.orderId?.trim()) {
    throw new OrderProcessingValidationError('Order id is required.');
  }

}
