// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { productVariantController } from '../controllers/ProductVariantController';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get('/', async (req, res, next) => {

  try {

    await productVariantController.getProductVariants(req, res);

  } catch (error) {

    next(error);

  }

});

router.get('/:id', async (req, res, next) => {

  try {

    await productVariantController.getProductVariant(req, res);

  } catch (error) {

    next(error);

  }

});

router.post('/', async (req, res, next) => {

  try {

    await productVariantController.createProductVariant(req, res);

  } catch (error) {

    next(error);

  }

});

router.put('/:id', async (req, res, next) => {

  try {

    await productVariantController.updateProductVariant(req, res);

  } catch (error) {

    next(error);

  }

});

router.delete('/:id', async (req, res, next) => {

  try {

    await productVariantController.deleteProductVariant(req, res);

  } catch (error) {

    next(error);

  }

});

// ==========================================================
// Exports
// ==========================================================

export default router;