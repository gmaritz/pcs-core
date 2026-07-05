"use strict";
// ==========================================================
// Category Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateCategory = validateCreateCategory;
exports.validateUpdateCategory = validateUpdateCategory;
function validateCreateCategory(dto) {
    if (!dto.name?.trim()) {
        throw new Error('Category name is required.');
    }
}
function validateUpdateCategory(dto) {
    if (dto.name !== undefined &&
        !dto.name.trim()) {
        throw new Error('Category name cannot be empty.');
    }
}
