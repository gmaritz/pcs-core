"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
// ==========================================================
// Router
// ==========================================================
const router = (0, express_1.Router)();
// ==========================================================
// Routes
// ==========================================================
router.get('/', async (req, res, next) => {
    try {
        await ProductController_1.productController.getProducts(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await ProductController_1.productController.getProduct(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        await ProductController_1.productController.createProduct(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await ProductController_1.productController.updateProduct(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await ProductController_1.productController.deleteProduct(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ==========================================================
// Exports
// ==========================================================
exports.default = router;
