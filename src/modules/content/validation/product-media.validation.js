"use strict";
// ==========================================================
// Product Media Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateProductMedia = validateCreateProductMedia;
exports.validateUpdateProductMedia = validateUpdateProductMedia;
function validateCreateProductMedia(dto) {
    if (!dto.productId?.trim()) {
        throw new Error('Product id is required.');
    }
    if (!dto.mediaId?.trim()) {
        throw new Error('Media id is required.');
    }
}
function validateUpdateProductMedia(dto) {
    if (dto.displayOrder !== undefined &&
        dto.displayOrder < 0) {
        throw new Error('Display order must be zero or greater.');
    }
}
