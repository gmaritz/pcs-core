"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateInventoryMovement = validateCreateInventoryMovement;
exports.validateUpdateInventoryMovement = validateUpdateInventoryMovement;
const client_1 = require("@prisma/client");
const MOVEMENT_TYPES = new Set([
    client_1.InventoryMovementType.STOCK_IN,
    client_1.InventoryMovementType.STOCK_OUT,
    client_1.InventoryMovementType.ADJUSTMENT,
    client_1.InventoryMovementType.RESERVED,
]);
function validateCreateInventoryMovement(dto) {
    if (!dto.movementType) {
        throw new Error('Movement type is required.');
    }
    if (!MOVEMENT_TYPES.has(dto.movementType)) {
        throw new Error('Movement type is invalid.');
    }
    if (dto.quantity === undefined) {
        throw new Error('Quantity is required.');
    }
    if (dto.quantity <= 0) {
        throw new Error('Quantity must be greater than zero.');
    }
    if (!dto.inventoryId?.trim()) {
        throw new Error('Inventory id is required.');
    }
}
function validateUpdateInventoryMovement(dto) {
    if (dto.movementType !== undefined &&
        !MOVEMENT_TYPES.has(dto.movementType)) {
        throw new Error('Movement type is invalid.');
    }
    if (dto.quantity !== undefined &&
        dto.quantity <= 0) {
        throw new Error('Quantity must be greater than zero.');
    }
}
