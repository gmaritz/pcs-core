// ==========================================================
// Supplier Adapter Validation
// ==========================================================

import {
  ImportJsonProductsDto,
} from '../types';

export class SupplierAdapterValidationError extends Error {

  constructor(message: string) {

    super(message);

    this.name = 'SupplierAdapterValidationError';

  }

}

export function validateImportJson(
  dto: ImportJsonProductsDto,
): void {

  if (!dto.supplierId?.trim()) {
    throw new SupplierAdapterValidationError('Supplier id is required.');
  }

  if (!dto.file?.trim()) {
    throw new SupplierAdapterValidationError('File is required.');
  }

}
