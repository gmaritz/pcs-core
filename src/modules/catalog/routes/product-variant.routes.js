"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductVariantController_1 = require("../controllers/ProductVariantController");
// ==========================================================
// Router
// ==========================================================
const router = (0, express_1.Router)();
// ==========================================================
// Routes
// ==========================================================
router.get('/', async (req, res, next) => {
    try {
        await ProductVariantController_1.productVariantController.getProductVariants(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await ProductVariantController_1.productVariantController.getProductVariant(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        await ProductVariantController_1.productVariantController.createProductVariant(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await ProductVariantController_1.productVariantController.updateProductVariant(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await ProductVariantController_1.productVariantController.deleteProductVariant(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ==========================================================
// Exports
// ==========================================================
exports.default = router;
