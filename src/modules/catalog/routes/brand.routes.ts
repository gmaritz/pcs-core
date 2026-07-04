// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { brandController } from '../controllers/BrandController';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get('/', async (req, res, next) => {
  try {
    await brandController.getBrands(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await brandController.getBrand(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await brandController.createBrand(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await brandController.updateBrand(req, res);
  } catch (error) {
    next(error);
  }
});

// ==========================================================
// Exports
// ==========================================================

export default router;