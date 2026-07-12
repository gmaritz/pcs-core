// ==========================================================
// Imports
// ==========================================================

import {
  Request,
  Response,
} from 'express';

import { ApiResponse } from '../../../shared/responses';

import {
  CheckoutDto,
} from '../types';
import {
  checkoutService,
  CheckoutServiceError,
} from '../services';
import {
  CheckoutValidationError,
  validateCheckout,
} from '../validation';

// ==========================================================
// Checkout Controller
// ==========================================================

export class CheckoutController {

  async checkout(
    req: Request<
      unknown,
      unknown,
      CheckoutDto
    >,
    res: Response,
  ): Promise<void> {

    try {

      validateCheckout(req.body);

      const result = await checkoutService.checkout(
        req.body,
      );

      ApiResponse.created(
        res,
        result,
      );

    } catch (error) {

      if (error instanceof CheckoutValidationError) {

        res.status(400).json({
          message: error.message,
        });

        return;

      }

      if (error instanceof CheckoutServiceError) {

        res.status(error.statusCode).json({
          message: error.message,
        });

        return;

      }

      throw error;

    }

  }

}

// ==========================================================
// Controller Instance
// ==========================================================

export const checkoutController =
  new CheckoutController();
