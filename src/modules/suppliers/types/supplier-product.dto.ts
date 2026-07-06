// ==========================================================
// Supplier Product DTOs
// ==========================================================

/**
 * Request payload for creating a supplier product relationship.
 */
export interface CreateSupplierProductDto {

  supplierSku: string;

  supplierProductName?: string;

  supplierPrice?: number;

  currency?: string;

  active?: boolean;

  supplierId: string;

  productVariantId: string;

}

/**
 * Request payload for updating a supplier product relationship.
 */
export interface UpdateSupplierProductDto {

  supplierSku?: string;

  supplierProductName?: string;

  supplierPrice?: number;

  currency?: string;

  active?: boolean;

  supplierId?: string;

  productVariantId?: string;

}
