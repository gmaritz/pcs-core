// ==========================================================
// Product Variant Validation
// ==========================================================

import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../types/product-variant.dto';

export function validateCreateProductVariant(
  dto: CreateProductVariantDto,
): void {

  if (!dto.name?.trim()) {
    throw new Error('Product variant name is required.');
  }

}

export function validateUpdateProductVariant(
  dto: UpdateProductVariantDto,
): void {

  if (
    dto.name !== undefined &&
    !dto.name.trim()
  ) {
    throw new Error(
      'Product variant name cannot be empty.',
    );
  }

}