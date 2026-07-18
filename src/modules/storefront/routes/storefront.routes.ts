import { Router } from 'express';

import {
  catalogueController,
} from '../catalogue';

import {
  shoppingController,
  storefrontController,
} from '../controllers';

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
    await catalogueController.renderLanding(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/shop/:sport/:category', async (req, res, next) => {
  try {
    await catalogueController.renderCategory(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/shop/:sport', async (req, res, next) => {
  try {
    await catalogueController.renderSport(req, res);
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

router.get('/cart', async (req, res, next) => {
  try {
    await shoppingController.renderCart(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/cart/add', async (req, res, next) => {
  try {
    await shoppingController.addToCart(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/cart/update', async (req, res, next) => {
  try {
    await shoppingController.updateCartItem(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/cart/remove', async (req, res, next) => {
  try {
    await shoppingController.removeCartItem(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/checkout', async (req, res, next) => {
  try {
    await shoppingController.renderCheckout(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/checkout/place-order', async (req, res, next) => {
  try {
    await shoppingController.placeOrder(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/login', (req, res) => {
  storefrontController.renderLogin(req, res);
});

router.get('/register', (req, res) => {
  storefrontController.renderRegister(req, res);
});

router.get('/order-confirmation/:orderId', async (req, res, next) => {
  try {
    await shoppingController.renderOrderConfirmation(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/account', async (req, res, next) => {
  try {
    await shoppingController.renderAccount(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/orders', async (req, res, next) => {
  try {
    await shoppingController.renderAccount(req, res);
  } catch (error) {
    next(error);
  }
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

router.get('/brands/:brand', async (req, res, next) => {
  try {
    await catalogueController.renderBrand(req, res);
  } catch (error) {
    next(error);
  }
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
