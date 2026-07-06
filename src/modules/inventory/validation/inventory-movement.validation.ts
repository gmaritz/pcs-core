// ==========================================================
// Imports
// ==========================================================

import { InventoryMovementType } from '@prisma/client';

import {
  CreateInventoryMovementDto,
  UpdateInventoryMovementDto,
} from '../types/inventory-movement.dto';

const MOVEMENT_TYPES = new Set<string>([
  InventoryMovementType.STOCK_IN,
  InventoryMovementType.STOCK_OUT,
  InventoryMovementType.ADJUSTMENT,
]);

export function validateCreateInventoryMovement(
  dto: CreateInventoryMovementDto,
): void {

  if (!dto.movementType) {
    throw new Error('Movement type is required.');
  }

  if (!MOVEMENT_TYPES.has(dto.movementType)) {
    throw new Error('Movement type is invalid.');
  }

  if (dto.quantity === undefined) {
    throw new Error('Quantity is required.');
  }

  if (dto.quantity <= 0) {
    throw new Error('Quantity must be greater than zero.');
  }

  if (!dto.inventoryId?.trim()) {
    throw new Error('Inventory id is required.');
  }

}

export function validateUpdateInventoryMovement(
  dto: UpdateInventoryMovementDto,
): void {

  if (
    dto.movementType !== undefined &&
    !MOVEMENT_TYPES.has(dto.movementType)
  ) {
    throw new Error('Movement type is invalid.');
  }

  if (
    dto.quantity !== undefined &&
    dto.quantity <= 0
  ) {
    throw new Error('Quantity must be greater than zero.');
  }

}