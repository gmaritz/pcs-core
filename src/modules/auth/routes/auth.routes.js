"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const jwt_middleware_1 = require("../middleware/jwt.middleware");
// ==========================================================
// Router
// ==========================================================
const router = (0, express_1.Router)();
// ==========================================================
// Routes
// ==========================================================
router.post('/login', async (req, res, next) => {
    try {
        await AuthController_1.authController.login(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/me', jwt_middleware_1.authenticate, async (req, res, next) => {
    try {
        await AuthController_1.authController.me(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ==========================================================
// Exports
// ==========================================================
exports.default = router;
