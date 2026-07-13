"use strict";
// ==========================================================
// Supplier Import Validator
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierImportValidator = exports.SupplierImportValidator = void 0;
class SupplierImportValidator {
    async validate(product) {
        const errors = [];
        if (!product.supplierSku) {
            errors.push('Missing SKU.');
        }
        if (!product.name) {
            errors.push('Missing name.');
        }
        if (!product.brand) {
            errors.push('Missing brand.');
        }
        if (!product.category) {
            errors.push('Missing category.');
        }
        if (!product.sport) {
            errors.push('Missing sport.');
        }
        if (Number.isNaN(product.price)) {
            errors.push('Invalid price.');
        }
        else if (product.price < 0) {
            errors.push('Negative price.');
        }
        if (Number.isNaN(product.quantity)) {
            errors.push('Invalid quantity.');
        }
        else if (product.quantity < 0) {
            errors.push('Negative quantity.');
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
exports.SupplierImportValidator = SupplierImportValidator;
exports.supplierImportValidator = new SupplierImportValidator();
