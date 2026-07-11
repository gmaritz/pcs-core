"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const responses_1 = require("../../shared/responses");
const AuthService_1 = require("../services/AuthService");
const auth_validation_1 = require("../validation/auth.validation");
// ==========================================================
// Auth Controller
// ==========================================================
class AuthController {
    // ========================================================
    // Commands
    // ========================================================
    async login(req, res) {
        (0, auth_validation_1.validateLogin)(req.body);
        const response = await AuthService_1.authService.login(req.body);
        if (!response) {
            res.status(401).json({
                message: 'Invalid credentials.',
            });
            return;
        }
        responses_1.ApiResponse.success(res, response);
    }
    // ========================================================
    // Queries
    // ========================================================
    async me(req, res) {
        const requestWithUser = req;
        const requestUser = requestWithUser.user;
        if (!requestUser) {
            res.status(401).json({
                message: 'Unauthorized.',
            });
            return;
        }
        const user = await AuthService_1.authService.getCurrentUser(requestUser.id);
        if (!user) {
            res.status(401).json({
                message: 'Unauthorized.',
            });
            return;
        }
        responses_1.ApiResponse.success(res, user);
    }
}
exports.AuthController = AuthController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.authController = new AuthController();
