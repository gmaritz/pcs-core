// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { sportController } from '../controllers/SportController';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get('/', async (req, res, next) => {

  try {

    await sportController.getSports(req, res);

  } catch (error) {

    next(error);

  }

});

router.get('/:id', async (req, res, next) => {

  try {

    await sportController.getSport(req, res);

  } catch (error) {

    next(error);

  }

});

router.post('/', async (req, res, next) => {

  try {

    await sportController.createSport(req, res);

  } catch (error) {

    next(error);

  }

});

router.put('/:id', async (req, res, next) => {

  try {

    await sportController.updateSport(req, res);

  } catch (error) {

    next(error);

  }

});

router.delete('/:id', async (req, res, next) => {

  try {

    await sportController.deleteSport(req, res);

  } catch (error) {

    next(error);

  }

});

// ==========================================================
// Exports
// ==========================================================

export default router;