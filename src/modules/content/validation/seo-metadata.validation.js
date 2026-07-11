"use strict";
// ==========================================================
// SEO Metadata Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateSeoMetadata = validateCreateSeoMetadata;
exports.validateUpdateSeoMetadata = validateUpdateSeoMetadata;
function validateCreateSeoMetadata(dto) {
    if (!dto.productId?.trim()) {
        throw new Error('Product id is required.');
    }
    if (!dto.metaTitle?.trim()) {
        throw new Error('Meta title is required.');
    }
}
function validateUpdateSeoMetadata(dto) {
    if (dto.metaTitle !== undefined &&
        !dto.metaTitle.trim()) {
        throw new Error('Meta title cannot be empty.');
    }
}
