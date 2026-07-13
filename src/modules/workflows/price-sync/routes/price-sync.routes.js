"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../auth");
const jwt_middleware_1 = require("../../../auth/middleware/jwt.middleware");
const authorization_middleware_1 = require("../../../auth/middleware/authorization.middleware");
const controllers_1 = require("../controllers");
// ==========================================================
// Router
// ==========================================================
const router = (0, express_1.Router)();
// ==========================================================
// Routes
// ==========================================================
router.post('/sync', jwt_middleware_1.authenticate, (0, authorization_middleware_1.authorize)(auth_1.Permissions.PRODUCTS_WRITE), async (req, res, next) => {
    try {
        await controllers_1.priceSyncController.synchronise(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ==========================================================
// Exports
// ==========================================================
exports.default = router;
