// ==========================================================
// Category DTOs
// ==========================================================

/**
 * Request payload for creating a category.
 */
export interface CreateCategoryDto {

  name: string;

  description?: string;

  displayOrder?: number;

  sportId: string;

}

/**
 * Request payload for updating a category.
 */
export interface UpdateCategoryDto {

  name?: string;

  description?: string;

  displayOrder?: number;

  sportId?: string;

}