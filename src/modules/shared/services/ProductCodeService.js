"use strict";
// ==========================================================
// Product Code Service
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productCodeService = exports.ProductCodeService = void 0;
class ProductCodeService {
    /**
     * Generate a temporary product code.
     *
     * Uses the same temporary strategy as Sport.
     */
    generate(name) {
        return name
            .substring(0, 3)
            .toUpperCase();
    }
}
exports.ProductCodeService = ProductCodeService;
// ==========================================================
// Service Instance
// ==========================================================
exports.productCodeService = new ProductCodeService();
