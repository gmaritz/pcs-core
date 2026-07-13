"use strict";
// ==========================================================
// Inventory Sync Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventorySyncValidationError = void 0;
exports.validateSynchroniseInventory = validateSynchroniseInventory;
class InventorySyncValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InventorySyncValidationError';
    }
}
exports.InventorySyncValidationError = InventorySyncValidationError;
function normalizeSku(value) {
    return value.trim().toUpperCase();
}
function validateProduct(product, index) {
    if (!product.supplierSku?.trim()) {
        throw new InventorySyncValidationError(`Row ${index}: Supplier SKU is required.`);
    }
    if (!Number.isInteger(product.quantity)) {
        throw new InventorySyncValidationError(`Row ${index}: Quantity must be an integer.`);
    }
    if (product.quantity < 0) {
        throw new InventorySyncValidationError(`Row ${index}: Quantity cannot be negative.`);
    }
}
function validateSynchroniseInventory(dto) {
    if (!dto.supplierId?.trim()) {
        throw new InventorySyncValidationError('Supplier id is required.');
    }
    if (!Array.isArray(dto.products)) {
        throw new InventorySyncValidationError('Products must be an array.');
    }
    if (dto.forceRollback !== undefined && typeof dto.forceRollback !== 'boolean') {
        throw new InventorySyncValidationError('forceRollback must be a boolean.');
    }
    const seenSkus = new Set();
    dto.products.forEach((product, index) => {
        validateProduct(product, index + 1);
        const sku = normalizeSku(product.supplierSku);
        if (seenSkus.has(sku)) {
            throw new InventorySyncValidationError(`Row ${index + 1}: Duplicate supplier SKU in request.`);
        }
        seenSkus.add(sku);
    });
}
