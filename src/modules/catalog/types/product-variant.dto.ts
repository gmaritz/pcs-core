// ==========================================================
// Product Variant DTOs
// ==========================================================

/**
 * Request payload for creating a product variant.
 */
export interface CreateProductVariantDto {

  name: string;

  description?: string;

  displayOrder?: number;

  productId: string;

}

/**
 * Request payload for updating a product variant.
 */
export interface UpdateProductVariantDto {

  name?: string;

  description?: string;

  displayOrder?: number;

  productId?: string;

}