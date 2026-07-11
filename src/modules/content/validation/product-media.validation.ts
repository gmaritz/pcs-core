// ==========================================================
// Product Media Validation
// ==========================================================

import {
  CreateProductMediaDto,
  UpdateProductMediaDto,
} from '../types/product-media.dto';

export function validateCreateProductMedia(
  dto: CreateProductMediaDto,
): void {

  if (!dto.productId?.trim()) {
    throw new Error('Product id is required.');
  }

  if (!dto.mediaId?.trim()) {
    throw new Error('Media id is required.');
  }

}

export function validateUpdateProductMedia(
  dto: UpdateProductMediaDto,
): void {

  if (
    dto.displayOrder !== undefined &&
    dto.displayOrder < 0
  ) {
    throw new Error(
      'Display order must be zero or greater.',
    );
  }

}
