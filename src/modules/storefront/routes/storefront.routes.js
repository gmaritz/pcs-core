"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    controllers_1.storefrontController.renderHome(req, res);
});
router.get('/shop', (req, res) => {
    controllers_1.storefrontController.renderCatalog(req, res);
});
router.get('/search', (req, res) => {
    controllers_1.storefrontController.renderSearch(req, res);
});
router.get('/category/:slug', (req, res) => {
    controllers_1.storefrontController.renderCategory(req, res);
});
router.get('/product/:slug', (req, res) => {
    controllers_1.storefrontController.renderProduct(req, res);
});
router.get('/cart', (req, res) => {
    controllers_1.storefrontController.renderCart(req, res);
});
router.get('/checkout', (req, res) => {
    controllers_1.storefrontController.renderCheckout(req, res);
});
router.get('/login', (req, res) => {
    controllers_1.storefrontController.renderLogin(req, res);
});
router.get('/register', (req, res) => {
    controllers_1.storefrontController.renderRegister(req, res);
});
router.get('/account', (req, res) => {
    controllers_1.storefrontController.renderAccount(req, res);
});
router.get('/orders', (req, res) => {
    controllers_1.storefrontController.renderOrders(req, res);
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
