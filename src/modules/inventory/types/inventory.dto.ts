// ==========================================================
// Inventory DTOs
// ==========================================================

/**
 * Request payload for creating inventory.
 */
export interface CreateInventoryDto {

  quantityOnHand: number;

  reorderLevel?: number;

  productVariantId: string;

}

/**
 * Request payload for updating inventory.
 */
export interface UpdateInventoryDto {

  quantityOnHand?: number;

  reorderLevel?: number;

  productVariantId?: string;

}
