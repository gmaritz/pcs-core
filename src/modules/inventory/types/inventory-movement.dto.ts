// ==========================================================
// Imports
// ==========================================================

import { InventoryMovementType } from '@prisma/client';

// ==========================================================
// Inventory Movement DTOs
// ==========================================================

/**
 * Request payload for creating an inventory movement.
 */
export interface CreateInventoryMovementDto {

  movementType: InventoryMovementType;

  quantity: number;

  reason?: string;

  reference?: string;

  inventoryId: string;

}

/**
 * Request payload for updating an inventory movement.
 */
export interface UpdateInventoryMovementDto {

  movementType?: InventoryMovementType;

  quantity?: number;

  reason?: string;

  reference?: string;

}