// ==========================================================
// Product Validation
// ==========================================================

import {
  CreateProductDto,
  UpdateProductDto,
} from '../types/product.dto';

export function validateCreateProduct(
  dto: CreateProductDto,
): void {

  if (!dto.name?.trim()) {
    throw new Error('Product name is required.');
  }

}

export function validateUpdateProduct(
  dto: UpdateProductDto,
): void {

  if (
    dto.name !== undefined &&
    !dto.name.trim()
  ) {
    throw new Error(
      'Product name cannot be empty.',
    );
  }

}