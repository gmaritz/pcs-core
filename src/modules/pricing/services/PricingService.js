"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingService = exports.PricingService = void 0;
const calculators_1 = require("../calculators");
const rules_1 = require("../rules");
// ==========================================================
// Pricing Service
// ==========================================================
class PricingService {
    calculateFromSupplierCost(input) {
        const markupPercentage = input.markupPercentage ??
            this.getDefaultMarkupPercentage();
        const sellingPrice = calculators_1.priceCalculator.calculateSellingPrice(input.supplierCost, markupPercentage);
        return {
            supplierCost: input.supplierCost,
            markupPercentage,
            sellingPrice,
        };
    }
    getDefaultMarkupPercentage() {
        return rules_1.defaultMarkupRule.getMarkupPercentage();
    }
}
exports.PricingService = PricingService;
exports.pricingService = new PricingService();
