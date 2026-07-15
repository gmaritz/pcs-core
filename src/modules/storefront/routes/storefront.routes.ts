import { Router } from 'express';

import { storefrontController } from '../controllers';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    await storefrontController.renderHome(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/shop', async (req, res, next) => {
  try {
    await storefrontController.renderCatalog(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/search', (req, res) => {
  storefrontController.renderSearch(req, res);
});

router.get('/category/:slug', (req, res) => {
  storefrontController.renderCategory(req, res);
});

router.get('/product/:slug', async (req, res, next) => {
  try {
    await storefrontController.renderProduct(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/cart', (req, res) => {
  storefrontController.renderCart(req, res);
});

router.get('/checkout', (req, res) => {
  storefrontController.renderCheckout(req, res);
});

router.get('/login', (req, res) => {
  storefrontController.renderLogin(req, res);
});

router.get('/register', (req, res) => {
  storefrontController.renderRegister(req, res);
});

router.get('/account', (req, res) => {
  storefrontController.renderAccount(req, res);
});

router.get('/orders', (req, res) => {
  storefrontController.renderOrders(req, res);
});

router.get('/wishlist', (req, res) => {
  storefrontController.renderWishlist(req, res);
});

router.get('/about', (req, res) => {
  storefrontController.renderAbout(req, res);
});

router.get('/contact', (req, res) => {
  storefrontController.renderContact(req, res);
});

router.get('/faq', (req, res) => {
  storefrontController.renderFaq(req, res);
});

router.get('/privacy', (req, res) => {
  storefrontController.renderPrivacy(req, res);
});

router.get('/terms', (req, res) => {
  storefrontController.renderTerms(req, res);
});

router.get('/sports', (req, res) => {
  storefrontController.renderSports(req, res);
});

router.get('/brands', (req, res) => {
  storefrontController.renderBrands(req, res);
});

router.get('/error', (req, res) => {
  storefrontController.renderError(req, res);
});

router.get('*all', (req, res) => {
  res.status(404);
  storefrontController.renderError(req, res);
});

export default router;
