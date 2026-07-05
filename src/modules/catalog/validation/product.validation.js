"use strict";
// ==========================================================
// Product Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateProduct = validateCreateProduct;
exports.validateUpdateProduct = validateUpdateProduct;
function validateCreateProduct(dto) {
    if (!dto.name?.trim()) {
        throw new Error('Product name is required.');
    }
}
function validateUpdateProduct(dto) {
    if (dto.name !== undefined &&
        !dto.name.trim()) {
        throw new Error('Product name cannot be empty.');
    }
}
