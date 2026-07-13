// ==========================================================
// Supplier Import Validation
// ==========================================================

import {
  ImportProductsDto,
} from '../types';

export class SupplierImportValidationError extends Error {

  constructor(message: string) {

    super(message);

    this.name = 'SupplierImportValidationError';

  }

}

export function validateImportProducts(
  dto: ImportProductsDto,
): void {

  if (!dto.supplierId?.trim()) {
    throw new SupplierImportValidationError('Supplier id is required.');
  }

  if (!dto.file?.trim()) {
    throw new SupplierImportValidationError('File is required.');
  }

}
