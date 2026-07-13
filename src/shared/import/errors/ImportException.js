"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportException = void 0;
class ImportException extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ImportException';
    }
}
exports.ImportException = ImportException;
