// ==========================================================
// Supplier Product Validation
// ==========================================================

import {
  CreateSupplierProductDto,
  UpdateSupplierProductDto,
} from '../types/supplier-product.dto';

export function validateCreateSupplierProduct(
  dto: CreateSupplierProductDto,
): void {

  if (!dto.supplierSku?.trim()) {
    throw new Error('Supplier SKU is required.');
  }

  if (!dto.supplierId?.trim()) {
    throw new Error('Supplier id is required.');
  }

  if (!dto.productVariantId?.trim()) {
    throw new Error('Product Variant id is required.');
  }

  if (
    dto.supplierPrice !== undefined &&
    dto.supplierPrice < 0
  ) {
    throw new Error(
      'Supplier price must be zero or greater.',
    );
  }

}

export function validateUpdateSupplierProduct(
  dto: UpdateSupplierProductDto,
): void {

  if (
    dto.supplierPrice !== undefined &&
    dto.supplierPrice < 0
  ) {
    throw new Error(
      'Supplier price must be zero or greater.',
    );
  }

}
