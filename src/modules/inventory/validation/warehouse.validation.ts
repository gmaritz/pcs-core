// ==========================================================
// Imports
// ==========================================================

import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from '../types/warehouse.dto';

export function validateCreateWarehouse(
  dto: CreateWarehouseDto,
): void {

  if (!dto.name?.trim()) {
    throw new Error('Warehouse name is required.');
  }

}

export function validateUpdateWarehouse(
  dto: UpdateWarehouseDto,
): void {

  if (
    dto.name !== undefined &&
    !dto.name.trim()
  ) {
    throw new Error('Warehouse name cannot be empty.');
  }

}