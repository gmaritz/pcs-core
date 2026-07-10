// ==========================================================
// Order Item DTOs
// ==========================================================

/**
 * Request payload for creating an order item.
 */
export interface CreateOrderItemDto {

  orderId: string;

  productVariantId: string;

  quantity: number;

  unitPrice?: number;

  totalPrice?: number;

}

/**
 * Request payload for updating an order item.
 */
export interface UpdateOrderItemDto {

  quantity?: number;

  unitPrice?: number;

  totalPrice?: number;

}
