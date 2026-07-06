// ==========================================================
// Supplier Validation
// ==========================================================

import {
  CreateSupplierDto,
  UpdateSupplierDto,
} from '../types/supplier.dto';

export function validateCreateSupplier(
  dto: CreateSupplierDto,
): void {

  if (!dto.name?.trim()) {
    throw new Error('Supplier name is required.');
  }

}

export function validateUpdateSupplier(
  dto: UpdateSupplierDto,
): void {

  if (
    dto.name !== undefined &&
    !dto.name.trim()
  ) {
    throw new Error(
      'Supplier name cannot be empty.',
    );
  }

}
