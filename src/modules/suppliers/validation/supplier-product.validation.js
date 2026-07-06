"use strict";
// ==========================================================
// Supplier Product Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateSupplierProduct = validateCreateSupplierProduct;
exports.validateUpdateSupplierProduct = validateUpdateSupplierProduct;
function validateCreateSupplierProduct(dto) {
    if (!dto.supplierSku?.trim()) {
        throw new Error('Supplier SKU is required.');
    }
    if (!dto.supplierId?.trim()) {
        throw new Error('Supplier id is required.');
    }
    if (!dto.productVariantId?.trim()) {
        throw new Error('Product Variant id is required.');
    }
    if (dto.supplierPrice !== undefined &&
        dto.supplierPrice < 0) {
        throw new Error('Supplier price must be zero or greater.');
    }
}
function validateUpdateSupplierProduct(dto) {
    if (dto.supplierPrice !== undefined &&
        dto.supplierPrice < 0) {
        throw new Error('Supplier price must be zero or greater.');
    }
}
