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
  supplierAdapterController,
} from '../controllers';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.post(
  '/products/json',
  authenticate,
  authorize(Permissions.SUPPLIERS_WRITE),
  async (req, res, next) => {

    try {

      await supplierAdapterController.importJson(
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
