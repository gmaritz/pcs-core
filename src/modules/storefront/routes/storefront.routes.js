"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catalogue_1 = require("../catalogue");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    try {
        await controllers_1.storefrontController.renderHome(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/shop', async (req, res, next) => {
    try {
        await catalogue_1.catalogueController.renderLanding(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/shop/:sport/:category', async (req, res, next) => {
    try {
        await catalogue_1.catalogueController.renderCategory(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/shop/:sport', async (req, res, next) => {
    try {
        await catalogue_1.catalogueController.renderSport(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/search', (req, res) => {
    controllers_1.storefrontController.renderSearch(req, res);
});
router.get('/category/:slug', (req, res) => {
    controllers_1.storefrontController.renderCategory(req, res);
});
router.get('/product/:slug', async (req, res, next) => {
    try {
        await controllers_1.storefrontController.renderProduct(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/cart', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.renderCart(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/cart/add', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.addToCart(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/cart/update', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.updateCartItem(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/cart/remove', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.removeCartItem(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/checkout', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.renderCheckout(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/checkout/place-order', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.placeOrder(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/login', (req, res) => {
    controllers_1.storefrontController.renderLogin(req, res);
});
router.get('/register', (req, res) => {
    controllers_1.storefrontController.renderRegister(req, res);
});
router.get('/order-confirmation/:orderId', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.renderOrderConfirmation(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/account', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.renderAccount(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/orders', async (req, res, next) => {
    try {
        await controllers_1.shoppingController.renderAccount(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/wishlist', (req, res) => {
    controllers_1.storefrontController.renderWishlist(req, res);
});
router.get('/about', (req, res) => {
    controllers_1.storefrontController.renderAbout(req, res);
});
router.get('/contact', (req, res) => {
    controllers_1.storefrontController.renderContact(req, res);
});
router.get('/faq', (req, res) => {
    controllers_1.storefrontController.renderFaq(req, res);
});
router.get('/privacy', (req, res) => {
    controllers_1.storefrontController.renderPrivacy(req, res);
});
router.get('/terms', (req, res) => {
    controllers_1.storefrontController.renderTerms(req, res);
});
router.get('/sports', (req, res) => {
    controllers_1.storefrontController.renderSports(req, res);
});
router.get('/brands/:brand', async (req, res, next) => {
    try {
        await catalogue_1.catalogueController.renderBrand(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/brands', (req, res) => {
    controllers_1.storefrontController.renderBrands(req, res);
});
router.get('/error', (req, res) => {
    controllers_1.storefrontController.renderError(req, res);
});
router.get('*all', (req, res) => {
    res.status(404);
    controllers_1.storefrontController.renderError(req, res);
});
exports.default = router;
