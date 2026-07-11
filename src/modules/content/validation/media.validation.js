"use strict";
// ==========================================================
// Media Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateMedia = validateCreateMedia;
exports.validateUpdateMedia = validateUpdateMedia;
function validateCreateMedia(dto) {
    if (!dto.filename?.trim()) {
        throw new Error('Media filename is required.');
    }
    if (!dto.mimeType?.trim()) {
        throw new Error('Media mimeType is required.');
    }
    if (!dto.extension?.trim()) {
        throw new Error('Media extension is required.');
    }
    if (!dto.url?.trim()) {
        throw new Error('Media url is required.');
    }
}
function validateUpdateMedia(dto) {
    if (dto.filename !== undefined &&
        !dto.filename.trim()) {
        throw new Error('Media filename cannot be empty.');
    }
    if (dto.url !== undefined &&
        !dto.url.trim()) {
        throw new Error('Media url cannot be empty.');
    }
}
