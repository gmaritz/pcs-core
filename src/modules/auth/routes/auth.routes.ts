// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import { authController } from '../controllers/AuthController';
import { authenticate } from '../middleware/jwt.middleware';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.post('/login', async (req, res, next) => {

  try {

    await authController.login(req, res);

  } catch (error) {

    next(error);

  }

});

router.get('/me', authenticate, async (req, res, next) => {

  try {

    await authController.me(req, res);

  } catch (error) {

    next(error);

  }

});

// ==========================================================
// Exports
// ==========================================================

export default router;
