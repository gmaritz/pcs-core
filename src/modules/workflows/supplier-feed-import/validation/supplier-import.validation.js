"use strict";
// ==========================================================
// Supplier Import Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierImportValidationError = void 0;
exports.validateImportProducts = validateImportProducts;
class SupplierImportValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SupplierImportValidationError';
    }
}
exports.SupplierImportValidationError = SupplierImportValidationError;
function validateImportProducts(dto) {
    if (!dto.supplierId?.trim()) {
        throw new SupplierImportValidationError('Supplier id is required.');
    }
    if (!dto.file?.trim()) {
        throw new SupplierImportValidationError('File is required.');
    }
}
