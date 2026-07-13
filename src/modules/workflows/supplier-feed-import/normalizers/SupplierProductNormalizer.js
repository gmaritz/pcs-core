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
    normalize(records) {
        return records.map((record) => ({
            supplierSku: normalizeText(record.supplierSku),
            name: normalizeText(record.name),
            brand: normalizeText(record.brand),
            category: normalizeText(record.category),
            sport: normalizeText(record.sport),
            price: Number(record.price),
            quantity: Number(record.quantity),
        }));
    }
}
exports.SupplierProductNormalizer = SupplierProductNormalizer;
exports.supplierProductNormalizer = new SupplierProductNormalizer();
