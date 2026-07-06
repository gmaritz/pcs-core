// ==========================================================
// Inventory Validation
// ==========================================================

import {
  CreateInventoryDto,
  UpdateInventoryDto,
} from '../types/inventory.dto';

export function validateCreateInventory(
  dto: CreateInventoryDto,
): void {

  if (dto.quantityOnHand === undefined) {
    throw new Error('Quantity on hand is required.');
  }

  if (dto.quantityOnHand < 0) {
    throw new Error('Quantity on hand cannot be negative.');
  }

  if (
    dto.reorderLevel !== undefined &&
    dto.reorderLevel < 0
  ) {
    throw new Error('Reorder level cannot be negative.');
  }

  if (!dto.productVariantId?.trim()) {
    throw new Error('Product variant id is required.');
  }

}

export function validateUpdateInventory(
  dto: UpdateInventoryDto,
): void {

  if (
    dto.quantityOnHand !== undefined &&
    dto.quantityOnHand < 0
  ) {
    throw new Error(
      'Quantity on hand cannot be negative.',
    );
  }

  if (
    dto.reorderLevel !== undefined &&
    dto.reorderLevel < 0
  ) {
    throw new Error(
      'Reorder level cannot be negative.',
    );
  }

}
