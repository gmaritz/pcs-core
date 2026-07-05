"use strict";
// ==========================================================
// API Response Helper
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data) {
        return res.status(200).json(data);
    }
    static created(res, data) {
        return res.status(201).json(data);
    }
    static noContent(res) {
        return res.sendStatus(204);
    }
    static notFound(res, message) {
        return res.status(404).json({
            message,
        });
    }
}
exports.ApiResponse = ApiResponse;
