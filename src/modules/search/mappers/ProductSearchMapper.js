"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSearchMapper = exports.ProductSearchMapper = void 0;
// ==========================================================
// Product Search Mapper
// ==========================================================
class ProductSearchMapper {
    toResultItem(record) {
        return {
            productId: record.productId,
            productName: record.productName,
            productSlug: record.productSlug,
            brand: record.brandName,
            category: record.categoryName,
            sport: record.sportName,
            variantId: record.variantId,
            variantName: record.variantName,
            variantSku: record.variantSku,
            sellingPrice: record.sellingPrice,
            available: record.available,
        };
    }
}
exports.ProductSearchMapper = ProductSearchMapper;
exports.productSearchMapper = new ProductSearchMapper();
