// ==========================================================
// Brand Validation
// ==========================================================

import {
  CreateBrandDto,
  UpdateBrandDto,
} from '../types/brand.dto';

export function validateCreateBrand(
  dto: CreateBrandDto,
): void {

  if (!dto.name?.trim()) {
    throw new Error('Brand name is required.');
  }

}

export function validateUpdateBrand(
  dto: UpdateBrandDto,
): void {

  if (dto.name !== undefined && !dto.name.trim()) {
    throw new Error('Brand name cannot be empty.');
  }

}