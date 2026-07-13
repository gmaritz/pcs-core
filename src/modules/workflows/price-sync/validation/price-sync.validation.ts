// ==========================================================
// Price Sync Validation
// ==========================================================

import {
  SynchronisePricingDto,
  SynchronisePricingProductDto,
} from '../types';

export class PriceSyncValidationError extends Error {

  constructor(message: string) {

    super(message);

    this.name = 'PriceSyncValidationError';

  }

}

function normalizeSku(
  value: string,
): string {

  return value.trim().toUpperCase();

}

function validateProduct(
  product: SynchronisePricingProductDto,
  index: number,
): void {

  if (!product.supplierSku?.trim()) {
    throw new PriceSyncValidationError(`Row ${index}: Supplier SKU is required.`);
  }

  if (!Number.isFinite(product.supplierCost)) {
    throw new PriceSyncValidationError(`Row ${index}: Supplier cost must be a valid number.`);
  }

  if (product.supplierCost < 0) {
    throw new PriceSyncValidationError(`Row ${index}: Supplier cost cannot be negative.`);
  }

}

export function validateSynchronisePricing(
  dto: SynchronisePricingDto,
): void {

  if (!dto.supplierId?.trim()) {
    throw new PriceSyncValidationError('Supplier id is required.');
  }

  if (!Array.isArray(dto.products)) {
    throw new PriceSyncValidationError('Products must be an array.');
  }

  if (dto.forceRollback !== undefined && typeof dto.forceRollback !== 'boolean') {
    throw new PriceSyncValidationError('forceRollback must be a boolean.');
  }

  const seenSkus = new Set<string>();

  dto.products.forEach((product, index) => {

    validateProduct(product, index + 1);

    const sku = normalizeSku(product.supplierSku);

    if (seenSkus.has(sku)) {
      throw new PriceSyncValidationError(`Row ${index + 1}: Duplicate supplier SKU in request.`);
    }

    seenSkus.add(sku);

  });

}
