// ==========================================================
// Category Validation
// ==========================================================

import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../types/category.dto';

export function validateCreateCategory(
  dto: CreateCategoryDto,
): void {

  if (!dto.name?.trim()) {
    throw new Error('Category name is required.');
  }

}

export function validateUpdateCategory(
  dto: UpdateCategoryDto,
): void {

  if (
    dto.name !== undefined &&
    !dto.name.trim()
  ) {
    throw new Error(
      'Category name cannot be empty.',
    );
  }

}