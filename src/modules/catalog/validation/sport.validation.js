"use strict";
// ==========================================================
// Sport Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateSport = validateCreateSport;
exports.validateUpdateSport = validateUpdateSport;
function validateCreateSport(dto) {
    if (!dto.name?.trim()) {
        throw new Error('Sport name is required.');
    }
}
function validateUpdateSport(dto) {
    if (dto.name !== undefined &&
        !dto.name.trim()) {
        throw new Error('Sport name cannot be empty.');
    }
}
