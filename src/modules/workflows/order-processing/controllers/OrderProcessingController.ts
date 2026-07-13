// ==========================================================
// Imports
// ==========================================================

import {
  Request,
  Response,
} from 'express';

import { ApiResponse } from '../../../shared/responses';

import {
  ProcessOrderDto,
} from '../types';
import {
  orderProcessingService,
  OrderProcessingServiceError,
} from '../services';
import {
  OrderProcessingValidationError,
  validateProcessOrder,
} from '../validation';

// ==========================================================
// Order Processing Controller
// ==========================================================

export class OrderProcessingController {

  async processOrder(
    req: Request<
      unknown,
      unknown,
      ProcessOrderDto
    >,
    res: Response,
  ): Promise<void> {

    try {

      validateProcessOrder(req.body);

      const result = await orderProcessingService.processOrder(
        req.body,
      );

      ApiResponse.success(
        res,
        result,
      );

    } catch (error) {

      if (error instanceof OrderProcessingValidationError) {

        res.status(400).json({
          message: error.message,
        });

        return;

      }

      if (error instanceof OrderProcessingServiceError) {

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

export const orderProcessingController =
  new OrderProcessingController();
