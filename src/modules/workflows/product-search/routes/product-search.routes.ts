// ==========================================================
// Imports
// ==========================================================

import {
  Router,
} from 'express';

import {
  productSearchWorkflowController,
} from '../controllers';

// ==========================================================
// Router
// ==========================================================

const router = Router();

// ==========================================================
// Routes
// ==========================================================

router.get(
  '/search',
  async (req, res, next) => {

    try {

      await productSearchWorkflowController.search(
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
