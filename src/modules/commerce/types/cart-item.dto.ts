// ==========================================================
// Cart Item DTOs
// ==========================================================

/**
 * Request payload for creating a cart item.
 */
export interface CreateCartItemDto {

  cartId: string;

  productVariantId: string;

  quantity: number;

}

/**
 * Request payload for updating a cart item.
 */
export interface UpdateCartItemDto {

  quantity?: number;

}
