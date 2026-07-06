"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateWarehouse = validateCreateWarehouse;
exports.validateUpdateWarehouse = validateUpdateWarehouse;
function validateCreateWarehouse(dto) {
    if (!dto.name?.trim()) {
        throw new Error('Warehouse name is required.');
    }
}
function validateUpdateWarehouse(dto) {
    if (dto.name !== undefined &&
        !dto.name.trim()) {
        throw new Error('Warehouse name cannot be empty.');
    }
}
