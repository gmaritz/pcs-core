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
  priceSyncService,
  PriceSyncServiceError,
} from '../services';
import {
  SynchronisePricingDto,
} from '../types';
import {
  PriceSyncValidationError,
  validateSynchronisePricing,
} from '../validation';

// ==========================================================
// Price Sync Controller
// ==========================================================

export class PriceSyncController {

  async synchronise(
    req: Request<
      unknown,
      unknown,
      SynchronisePricingDto
    >,
    res: Response,
  ): Promise<void> {

    try {

      validateSynchronisePricing(req.body);

      const result = await priceSyncService.synchronise(
        req.body,
      );

      ApiResponse.success(
        res,
        result,
      );

    } catch (error) {

      if (error instanceof PriceSyncValidationError) {

        res.status(400).json({
          message: error.message,
        });

        return;

      }

      if (error instanceof PriceSyncServiceError) {

        res.status(error.statusCode).json({
          message: error.message,
        });

        return;

      }

      throw error;

    }

  }

}

export const priceSyncController =
  new PriceSyncController();
