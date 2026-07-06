// ==========================================================
// Warehouse DTOs
// ==========================================================

/**
 * Request payload for creating a warehouse.
 */
export interface CreateWarehouseDto {

  name: string;

  description?: string;

  addressLine1?: string;

  addressLine2?: string;

  suburb?: string;

  city?: string;

  province?: string;

  postalCode?: string;

  country?: string;

  contactName?: string;

  contactEmail?: string;

  contactPhone?: string;

  displayOrder?: number;

}

/**
 * Request payload for updating a warehouse.
 */
export interface UpdateWarehouseDto {

  name?: string;

  description?: string;

  addressLine1?: string;

  addressLine2?: string;

  suburb?: string;

  city?: string;

  province?: string;

  postalCode?: string;

  country?: string;

  contactName?: string;

  contactEmail?: string;

  contactPhone?: string;

  displayOrder?: number;

}