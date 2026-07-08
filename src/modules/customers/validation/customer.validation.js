"use strict";
// ==========================================================
// Customer Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateCustomer = validateCreateCustomer;
exports.validateUpdateCustomer = validateUpdateCustomer;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateCreateCustomer(dto) {
    if (!dto.firstName?.trim()) {
        throw new Error('Customer first name is required.');
    }
    if (!dto.lastName?.trim()) {
        throw new Error('Customer last name is required.');
    }
    if (!dto.email?.trim()) {
        throw new Error('Customer email is required.');
    }
    if (!EMAIL_PATTERN.test(dto.email)) {
        throw new Error('Customer email must be valid.');
    }
}
function validateUpdateCustomer(dto) {
    if (dto.firstName !== undefined &&
        !dto.firstName.trim()) {
        throw new Error('Customer first name cannot be empty.');
    }
    if (dto.lastName !== undefined &&
        !dto.lastName.trim()) {
        throw new Error('Customer last name cannot be empty.');
    }
    if (dto.email !== undefined &&
        !EMAIL_PATTERN.test(dto.email)) {
        throw new Error('Customer email must be valid.');
    }
}
