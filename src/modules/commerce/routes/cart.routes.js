"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CartController_1 = require("../controllers/CartController");
// ==========================================================
// Router
// ==========================================================
const router = (0, express_1.Router)();
// ==========================================================
// Routes
// ==========================================================
router.get('/', async (req, res, next) => {
    try {
        await CartController_1.cartController.getCarts(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await CartController_1.cartController.getCart(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        await CartController_1.cartController.createCart(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await CartController_1.cartController.updateCart(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await CartController_1.cartController.deleteCart(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ==========================================================
// Exports
// ==========================================================
exports.default = router;
