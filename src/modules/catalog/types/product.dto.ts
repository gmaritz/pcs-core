// ==========================================================
// Product DTOs
// ==========================================================

/**
 * Request payload for creating a product.
 */
export interface CreateProductDto {

  name: string;

  description?: string;

  displayOrder?: number;

  sportId: string;

  brandId: string;

  categoryId: string;

}

/**
 * Request payload for updating a product.
 */
export interface UpdateProductDto {

  name?: string;

  description?: string;

  displayOrder?: number;

  sportId?: string;

  brandId?: string;

  categoryId?: string;

}