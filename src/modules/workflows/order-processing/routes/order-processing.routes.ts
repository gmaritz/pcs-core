// ==========================================================
// Imports
// ==========================================================

import { Router } from 'express';

import {
  authenticate,
} from '../../../auth/middleware/jwt.middleware';
import {
  authorize,
} from '../../../auth/middleware/authorization.middleware';
import {
  Permissions,
} from '../../../auth';

import {
  orderProcessingController,
} from '../controllers';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.post(
  '/',
  authenticate,
  authorize(Permissions.ORDERS_WRITE),
  async (req, res, next) => {

    try {

      await orderProcessingController.processOrder(
        req,
        res,
      );

    } catch (error) {

      next(error);

    }

  },
);

// ==========================================================
// Exports
// ==========================================================

export default router;
