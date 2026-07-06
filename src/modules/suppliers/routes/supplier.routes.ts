// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { supplierController } from '../controllers/SupplierController';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get('/', async (req, res, next) => {

  try {

    await supplierController.getSuppliers(req, res);

  } catch (error) {

    next(error);

  }

});

router.get('/:id', async (req, res, next) => {

  try {

    await supplierController.getSupplier(req, res);

  } catch (error) {

    next(error);

  }

});

router.post('/', async (req, res, next) => {

  try {

    await supplierController.createSupplier(req, res);

  } catch (error) {

    next(error);

  }

});

router.put('/:id', async (req, res, next) => {

  try {

    await supplierController.updateSupplier(req, res);

  } catch (error) {

    next(error);

  }

});

router.delete('/:id', async (req, res, next) => {

  try {

    await supplierController.deleteSupplier(req, res);

  } catch (error) {

    next(error);

  }

});

// ==========================================================
// Exports
// ==========================================================

export default router;
