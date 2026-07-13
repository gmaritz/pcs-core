// ==========================================================
// Imports
// ==========================================================

import {
  Request,
  Response,
} from 'express';

import {
  ApiResponse,
} from '../../../shared/responses';

import {
  productSearchWorkflowService,
} from '../services';
import {
  ProductSearchValidationError,
  validateProductSearchQuery,
} from '../validation';

// ==========================================================
// Product Search Workflow Controller
// ==========================================================

export class ProductSearchWorkflowController {

  async search(
    req: Request,
    res: Response,
  ): Promise<void> {

    try {

      const query = validateProductSearchQuery(
        req.query as Record<string, unknown>,
      );

      const result = await productSearchWorkflowService.search(
        query,
      );

      ApiResponse.success(
        res,
        result,
      );

    } catch (error) {

      if (error instanceof ProductSearchValidationError) {

        res.status(400).json({
          message: error.message,
        });

        return;

      }

      throw error;

    }

  }

}

export const productSearchWorkflowController =
  new ProductSearchWorkflowController();
