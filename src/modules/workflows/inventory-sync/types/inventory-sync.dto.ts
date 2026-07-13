// ==========================================================
// Inventory Sync DTOs
// ==========================================================

export interface SynchroniseInventoryProductDto {

  supplierSku: string;

  quantity: number;

}

export interface SynchroniseInventoryDto {

  supplierId: string;

  products: SynchroniseInventoryProductDto[];

  forceRollback?: boolean;

}

export interface SynchroniseInventorySummary {

  processed: number;

  updated: number;

  unchanged: number;

  missing: number;

  errors: string[];

}
