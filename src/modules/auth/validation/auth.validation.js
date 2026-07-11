"use strict";
// ==========================================================
// Auth Validation
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = validateLogin;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateLogin(dto) {
    if (!dto.email?.trim()) {
        throw new Error('Email is required.');
    }
    if (!EMAIL_REGEX.test(dto.email)) {
        throw new Error('Email must be valid.');
    }
    if (!dto.password?.trim()) {
        throw new Error('Password is required.');
    }
}
