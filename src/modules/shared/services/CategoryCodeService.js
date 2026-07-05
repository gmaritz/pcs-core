"use strict";
// ==========================================================
// Category Code Service
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryCodeService = exports.CategoryCodeService = void 0;
class CategoryCodeService {
    /**
     * Generate a base category code.
     *
     * Examples:
     * Shoes    -> SHO
     * Rackets  -> RAC
     * Apparel  -> APP
     */
    generate(name) {
        return name
            .replace(/[^A-Za-z0-9]/g, '')
            .toUpperCase()
            .substring(0, 3);
    }
}
exports.CategoryCodeService = CategoryCodeService;
// ==========================================================
// Service Instance
// ==========================================================
exports.categoryCodeService = new CategoryCodeService();
