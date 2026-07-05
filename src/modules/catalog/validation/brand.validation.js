"use strict";
// ==========================================================
// Brand Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateBrand = validateCreateBrand;
exports.validateUpdateBrand = validateUpdateBrand;
function validateCreateBrand(dto) {
    if (!dto.name?.trim()) {
        throw new Error('Brand name is required.');
    }
}
function validateUpdateBrand(dto) {
    if (dto.name !== undefined && !dto.name.trim()) {
        throw new Error('Brand name cannot be empty.');
    }
}
