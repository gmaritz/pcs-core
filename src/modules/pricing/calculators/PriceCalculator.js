"use strict";
// ==========================================================
// Price Calculator
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceCalculator = exports.PriceCalculator = void 0;
class PriceCalculator {
    calculateSellingPrice(supplierCost, markupPercentage) {
        const sellingPrice = supplierCost * (1 + (markupPercentage / 100));
        return this.roundPrice(sellingPrice);
    }
    calculateMarkup(supplierCost, sellingPrice) {
        if (supplierCost <= 0) {
            return 0;
        }
        const markup = ((sellingPrice - supplierCost) / supplierCost) * 100;
        return this.roundPrice(markup);
    }
    roundPrice(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
}
exports.PriceCalculator = PriceCalculator;
exports.priceCalculator = new PriceCalculator();
