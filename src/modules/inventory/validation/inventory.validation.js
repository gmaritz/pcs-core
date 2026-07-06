"use strict";
// ==========================================================
// Inventory Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateInventory = validateCreateInventory;
exports.validateUpdateInventory = validateUpdateInventory;
function validateCreateInventory(dto) {
    if (dto.quantityOnHand === undefined) {
        throw new Error('Quantity on hand is required.');
    }
    if (dto.quantityOnHand < 0) {
        throw new Error('Quantity on hand cannot be negative.');
    }
    if (dto.reorderLevel !== undefined &&
        dto.reorderLevel < 0) {
        throw new Error('Reorder level cannot be negative.');
    }
    if (!dto.productVariantId?.trim()) {
        throw new Error('Product variant id is required.');
    }
}
function validateUpdateInventory(dto) {
    if (dto.quantityOnHand !== undefined &&
        dto.quantityOnHand < 0) {
        throw new Error('Quantity on hand cannot be negative.');
    }
    if (dto.reorderLevel !== undefined &&
        dto.reorderLevel < 0) {
        throw new Error('Reorder level cannot be negative.');
    }
}
