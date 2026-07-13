"use strict";
// ==========================================================
// Supplier Adapter Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierAdapterValidationError = void 0;
exports.validateImportJson = validateImportJson;
class SupplierAdapterValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SupplierAdapterValidationError';
    }
}
exports.SupplierAdapterValidationError = SupplierAdapterValidationError;
function validateImportJson(dto) {
    if (!dto.supplierId?.trim()) {
        throw new SupplierAdapterValidationError('Supplier id is required.');
    }
    if (!dto.file?.trim()) {
        throw new SupplierAdapterValidationError('File is required.');
    }
}
