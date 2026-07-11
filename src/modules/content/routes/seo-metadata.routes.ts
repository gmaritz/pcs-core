// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { seoMetadataController } from '../controllers/SeoMetadataController';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get('/', async (req, res, next) => {

  try {

    await seoMetadataController.getSeoMetadata(req, res);

  } catch (error) {

    next(error);

  }

});

router.get('/:id', async (req, res, next) => {

  try {

    await seoMetadataController.getSeoMetadataItem(req, res);

  } catch (error) {

    next(error);

  }

});

router.post('/', async (req, res, next) => {

  try {

    await seoMetadataController.createSeoMetadata(req, res);

  } catch (error) {

    next(error);

  }

});

router.put('/:id', async (req, res, next) => {

  try {

    await seoMetadataController.updateSeoMetadata(req, res);

  } catch (error) {

    next(error);

  }

});

router.delete('/:id', async (req, res, next) => {

  try {

    await seoMetadataController.deleteSeoMetadata(req, res);

  } catch (error) {

    next(error);

  }

});

// ==========================================================
// Exports
// ==========================================================

export default router;
