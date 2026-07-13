"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFilter = exports.ProductFilter = void 0;
// ==========================================================
// Product Filter
// ==========================================================
class ProductFilter {
    apply(records, criteria) {
        return records.filter((record) => {
            if (criteria.sport && !equalsIgnoreCase(record.sportName, criteria.sport)) {
                return false;
            }
            if (criteria.brand && !equalsIgnoreCase(record.brandName, criteria.brand)) {
                return false;
            }
            if (criteria.category && !equalsIgnoreCase(record.categoryName, criteria.category)) {
                return false;
            }
            if (criteria.minPrice !== undefined && record.sellingPrice < criteria.minPrice) {
                return false;
            }
            if (criteria.maxPrice !== undefined && record.sellingPrice > criteria.maxPrice) {
                return false;
            }
            if (criteria.available !== undefined && record.available !== criteria.available) {
                return false;
            }
            return true;
        });
    }
}
exports.ProductFilter = ProductFilter;
function equalsIgnoreCase(left, right) {
    return left.trim().toLowerCase() === right.trim().toLowerCase();
}
exports.productFilter = new ProductFilter();
