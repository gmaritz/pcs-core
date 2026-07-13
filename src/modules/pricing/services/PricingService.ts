// ==========================================================
// Imports
// ==========================================================

import {
  priceCalculator,
} from '../calculators';
import {
  defaultMarkupRule,
} from '../rules';
import {
  PricingCalculationInput,
  PricingCalculationResult,
} from '../types';

// ==========================================================
// Pricing Service
// ==========================================================

export class PricingService {

  calculateFromSupplierCost(
    input: PricingCalculationInput,
  ): PricingCalculationResult {

    const markupPercentage =
      input.markupPercentage ??
      this.getDefaultMarkupPercentage();

    const sellingPrice =
      priceCalculator.calculateSellingPrice(
        input.supplierCost,
        markupPercentage,
      );

    return {
      supplierCost: input.supplierCost,
      markupPercentage,
      sellingPrice,
    };

  }

  getDefaultMarkupPercentage(): number {

    return defaultMarkupRule.getMarkupPercentage();

  }

}

export const pricingService =
  new PricingService();
