"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const AuthorizationService_1 = require("../services/AuthorizationService");
// ==========================================================
// Authorization Middleware
// ==========================================================
function authorize(permission) {
    return async (req, res, next) => {
        const requestWithUser = req;
        if (!requestWithUser.user) {
            res.status(401).json({
                message: 'Unauthorized.',
            });
            return;
        }
        const hasPermission = await AuthorizationService_1.authorizationService.hasPermission(requestWithUser.user.id, permission);
        if (!hasPermission) {
            res.status(403).json({
                message: 'Forbidden.',
            });
            return;
        }
        next();
    };
}
