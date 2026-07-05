"use strict";
// ==========================================================
// Brand Code Service
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandCodeService = exports.BrandCodeService = void 0;
class BrandCodeService {
    /**
     * Generate a base brand code.
     *
     * Examples:
     * Wilson  -> WIL
     * Yonex   -> YON
     * Head    -> HEA
     */
    generate(name) {
        return name
            .replace(/[^A-Za-z0-9]/g, '')
            .toUpperCase()
            .substring(0, 3);
    }
}
exports.BrandCodeService = BrandCodeService;
// ==========================================================
// Service Instance
// ==========================================================
exports.brandCodeService = new BrandCodeService();
