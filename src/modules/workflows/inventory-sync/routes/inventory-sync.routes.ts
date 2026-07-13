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
  inventorySyncController,
} from '../controllers';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.post(
  '/sync',
  authenticate,
  authorize(Permissions.INVENTORY_WRITE),
  async (req, res, next) => {

    try {

      await inventorySyncController.synchronise(
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
