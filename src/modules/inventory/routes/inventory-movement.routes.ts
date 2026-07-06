// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { inventoryMovementController } from '../controllers/InventoryMovementController';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get('/', async (req, res, next) => {

  try {

    await inventoryMovementController.getInventoryMovements(req, res);

  } catch (error) {

    next(error);

  }

});

router.get('/:id', async (req, res, next) => {

  try {

    await inventoryMovementController.getInventoryMovement(req, res);

  } catch (error) {

    next(error);

  }

});

router.post('/', async (req, res, next) => {

  try {

    await inventoryMovementController.createInventoryMovement(req, res);

  } catch (error) {

    next(error);

  }

});

router.put('/:id', async (req, res, next) => {

  try {

    await inventoryMovementController.updateInventoryMovement(req, res);

  } catch (error) {

    next(error);

  }

});

router.delete('/:id', async (req, res, next) => {

  try {

    await inventoryMovementController.deleteInventoryMovement(req, res);

  } catch (error) {

    next(error);

  }

});

// ==========================================================
// Exports
// ==========================================================

export default router;