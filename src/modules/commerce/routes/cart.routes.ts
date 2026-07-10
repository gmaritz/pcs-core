// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { cartController } from '../controllers/CartController';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get('/', async (req, res, next) => {

  try {

    await cartController.getCarts(req, res);

  } catch (error) {

    next(error);

  }

});

router.get('/:id', async (req, res, next) => {

  try {

    await cartController.getCart(req, res);

  } catch (error) {

    next(error);

  }

});

router.post('/', async (req, res, next) => {

  try {

    await cartController.createCart(req, res);

  } catch (error) {

    next(error);

  }

});

router.put('/:id', async (req, res, next) => {

  try {

    await cartController.updateCart(req, res);

  } catch (error) {

    next(error);

  }

});

router.delete('/:id', async (req, res, next) => {

  try {

    await cartController.deleteCart(req, res);

  } catch (error) {

    next(error);

  }

});

// ==========================================================
// Exports
// ==========================================================

export default router;
