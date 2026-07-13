"use strict";
// ==========================================================
// Supplier Import Validator
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierImportValidator = exports.SupplierImportValidator = void 0;
function normalizeName(value) {
    return value.trim().toLowerCase();
}
class SupplierImportValidator {
    validate(records, references) {
        const errors = [];
        const supplierSkus = new Set();
        for (const [index, record] of records.entries()) {
            const row = index + 1;
            if (!record.supplierSku) {
                errors.push(`Row ${row}: Missing SKU.`);
            }
            if (!record.name) {
                errors.push(`Row ${row}: Missing name.`);
            }
            if (!record.brand) {
                errors.push(`Row ${row}: Missing brand.`);
            }
            if (!record.category) {
                errors.push(`Row ${row}: Missing category.`);
            }
            if (!record.sport) {
                errors.push(`Row ${row}: Missing sport.`);
            }
            if (Number.isNaN(record.price)) {
                errors.push(`Row ${row}: Invalid price.`);
            }
            else if (record.price < 0) {
                errors.push(`Row ${row}: Negative price.`);
            }
            if (Number.isNaN(record.quantity)) {
                errors.push(`Row ${row}: Invalid quantity.`);
            }
            else if (record.quantity < 0) {
                errors.push(`Row ${row}: Negative quantity.`);
            }
            const normalizedSupplierSku = normalizeName(record.supplierSku);
            if (normalizedSupplierSku) {
                if (supplierSkus.has(normalizedSupplierSku)) {
                    errors.push(`Row ${row}: Duplicate supplier SKU in import payload.`);
                }
                supplierSkus.add(normalizedSupplierSku);
            }
            if (record.brand &&
                !references.brandsByName.has(normalizeName(record.brand))) {
                errors.push(`Row ${row}: Unknown brand \"${record.brand}\".`);
            }
            if (record.category &&
                !references.categoriesByName.has(normalizeName(record.category))) {
                errors.push(`Row ${row}: Unknown category \"${record.category}\".`);
            }
            if (record.sport &&
                !references.sportsByName.has(normalizeName(record.sport))) {
                errors.push(`Row ${row}: Unknown sport \"${record.sport}\".`);
            }
        }
        return errors;
    }
}
exports.SupplierImportValidator = SupplierImportValidator;
exports.supplierImportValidator = new SupplierImportValidator();
