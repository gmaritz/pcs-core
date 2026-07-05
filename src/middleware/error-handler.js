"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
// ==========================================================
// Error Handler Middleware
// ==========================================================
function errorHandler(error, _req, res, _next) {
    console.error(error);
    res.status(500).json({
        message: error.message,
    });
}
