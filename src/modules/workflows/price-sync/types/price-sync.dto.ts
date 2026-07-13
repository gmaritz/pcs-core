// ==========================================================
// Price Sync DTOs
// ==========================================================

export interface SynchronisePricingProductDto {

  supplierSku: string;

  supplierCost: number;

}

export interface SynchronisePricingDto {

  supplierId: string;

  products: SynchronisePricingProductDto[];

  forceRollback?: boolean;

}

export interface SynchronisePricingSummary {

  processed: number;

  updated: number;

  manualOverrides: number;

  errors: string[];

}
