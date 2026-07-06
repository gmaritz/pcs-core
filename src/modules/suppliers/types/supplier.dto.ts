// ==========================================================
// Supplier DTOs
// ==========================================================

/**
 * Request payload for creating a supplier.
 */
export interface CreateSupplierDto {

  name: string;

  description?: string;

  website?: string;

  email?: string;

  telephone?: string;

  displayOrder?: number;

}

/**
 * Request payload for updating a supplier.
 */
export interface UpdateSupplierDto {

  name?: string;

  description?: string;

  website?: string;

  email?: string;

  telephone?: string;

  displayOrder?: number;

}
