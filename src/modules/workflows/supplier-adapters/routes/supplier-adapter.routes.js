"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_middleware_1 = require("../../../auth/middleware/jwt.middleware");
const authorization_middleware_1 = require("../../../auth/middleware/authorization.middleware");
const auth_1 = require("../../../auth");
const controllers_1 = require("../controllers");
// ==========================================================
// Router
// ==========================================================
const router = (0, express_1.Router)();
// ==========================================================
// Routes
// ==========================================================
router.post('/products/json', jwt_middleware_1.authenticate, (0, authorization_middleware_1.authorize)(auth_1.Permissions.SUPPLIERS_WRITE), async (req, res, next) => {
    try {
        await controllers_1.supplierAdapterController.importJson(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ==========================================================
// Exports
// ==========================================================
exports.default = router;
