"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportValidationError = void 0;
class ImportValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ImportValidationError';
    }
}
exports.ImportValidationError = ImportValidationError;
