// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { productController } from '../controllers/ProductController';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get('/', async (req, res, next) => {

  try {

    await productController.getProducts(req, res);

  } catch (error) {

    next(error);

  }

});

router.get('/:id', async (req, res, next) => {

  try {

    await productController.getProduct(req, res);

  } catch (error) {

    next(error);

  }

});

router.post('/', async (req, res, next) => {

  try {

    await productController.createProduct(req, res);

  } catch (error) {

    next(error);

  }

});

router.put('/:id', async (req, res, next) => {

  try {

    await productController.updateProduct(req, res);

  } catch (error) {

    next(error);

  }

});

router.delete('/:id', async (req, res, next) => {

  try {

    await productController.deleteProduct(req, res);

  } catch (error) {

    next(error);

  }

});

// ==========================================================
// Exports
// ==========================================================

export default router;