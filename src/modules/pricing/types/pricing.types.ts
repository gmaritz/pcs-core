// ==========================================================
// Pricing Types
// ==========================================================

export interface PricingCalculationInput {

  supplierCost: number;

  markupPercentage?: number;

}

export interface PricingCalculationResult {

  supplierCost: number;

  markupPercentage: number;

  sellingPrice: number;

}
