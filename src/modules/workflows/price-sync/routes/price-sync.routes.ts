// ==========================================================
// Imports
// ==========================================================

import {
  Router,
} from 'express';

import {
  Permissions,
} from '../../../auth';
import {
  authenticate,
} from '../../../auth/middleware/jwt.middleware';
import {
  authorize,
} from '../../../auth/middleware/authorization.middleware';

import {
  priceSyncController,
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
  authorize(Permissions.PRODUCTS_WRITE),
  async (req, res, next) => {

    try {

      await priceSyncController.synchronise(
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
