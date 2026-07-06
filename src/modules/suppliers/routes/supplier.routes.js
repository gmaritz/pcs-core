"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SupplierController_1 = require("../controllers/SupplierController");
// ==========================================================
// Router
// ==========================================================
const router = (0, express_1.Router)();
// ==========================================================
// Routes
// ==========================================================
router.get('/', async (req, res, next) => {
    try {
        await SupplierController_1.supplierController.getSuppliers(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await SupplierController_1.supplierController.getSupplier(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        await SupplierController_1.supplierController.createSupplier(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await SupplierController_1.supplierController.updateSupplier(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await SupplierController_1.supplierController.deleteSupplier(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ==========================================================
// Exports
// ==========================================================
exports.default = router;
