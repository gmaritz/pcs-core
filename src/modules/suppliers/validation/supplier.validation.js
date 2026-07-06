"use strict";
// ==========================================================
// Supplier Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateSupplier = validateCreateSupplier;
exports.validateUpdateSupplier = validateUpdateSupplier;
function validateCreateSupplier(dto) {
    if (!dto.name?.trim()) {
        throw new Error('Supplier name is required.');
    }
}
function validateUpdateSupplier(dto) {
    if (dto.name !== undefined &&
        !dto.name.trim()) {
        throw new Error('Supplier name cannot be empty.');
    }
}
