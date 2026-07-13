"use strict";
// ==========================================================
// Supplier Product Normalizer
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierProductNormalizer = exports.SupplierProductNormalizer = void 0;
function normalizeText(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim();
}
class SupplierProductNormalizer {
    async normalize(record) {
        return {
            supplierSku: normalizeText(record.supplierSku),
            name: normalizeText(record.name),
            description: typeof record.description === 'string'
                ? record.description.trim()
                : undefined,
            brand: normalizeText(record.brand),
            category: normalizeText(record.category),
            sport: normalizeText(record.sport),
            variant: typeof record.variant === 'string'
                ? record.variant.trim()
                : undefined,
            barcode: typeof record.barcode === 'string'
                ? record.barcode.trim()
                : undefined,
            price: Number(record.price),
            quantity: Number(record.quantity),
            currency: typeof record.currency === 'string'
                ? record.currency.trim()
                : undefined,
            images: Array.isArray(record.images)
                ? record.images
                    .filter((image) => typeof image === 'string')
                    .map((image) => image.trim())
                : undefined,
        };
    }
}
exports.SupplierProductNormalizer = SupplierProductNormalizer;
exports.supplierProductNormalizer = new SupplierProductNormalizer();
