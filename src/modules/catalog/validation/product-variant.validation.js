"use strict";
// ==========================================================
// Product Variant Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateProductVariant = validateCreateProductVariant;
exports.validateUpdateProductVariant = validateUpdateProductVariant;
function validateCreateProductVariant(dto) {
    if (!dto.name?.trim()) {
        throw new Error('Product variant name is required.');
    }
}
function validateUpdateProductVariant(dto) {
    if (dto.name !== undefined &&
        !dto.name.trim()) {
        throw new Error('Product variant name cannot be empty.');
    }
}
