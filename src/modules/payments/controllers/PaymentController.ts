// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from '../types/payment.dto';

import { paymentService } from '../services';

import {
  validateCreatePayment,
  validateUpdatePayment,
} from '../validation/payment.validation';

// ==========================================================
// Payment Controller
// ==========================================================

export class PaymentController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all payments.
   */
  async getPayments(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const payments =
      await paymentService.getPayments();

    ApiResponse.success(
      res,
      payments,
    );

  }

  /**
   * Retrieve a single payment.
   */
  async getPayment(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const payment =
      await paymentService.getPayment(
        req.params.id,
      );

    if (!payment) {

      ApiResponse.notFound(
        res,
        'Payment not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      payment,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createPayment(
    req: Request<
      unknown,
      unknown,
      CreatePaymentDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreatePayment(
      req.body,
    );

    const payment =
      await paymentService.createPayment(
        req.body,
      );

    ApiResponse.created(
      res,
      payment,
    );

  }

  async updatePayment(
    req: Request<
      IdParams,
      unknown,
      UpdatePaymentDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdatePayment(
      req.body,
    );

    const payment =
      await paymentService.updatePayment(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      payment,
    );

  }

  async deletePayment(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await paymentService.deletePayment(
      req.params.id,
    );

    ApiResponse.noContent(
      res,
    );

  }

}

// ==========================================================
// Controller Instance
// ==========================================================

export const paymentController =
  new PaymentController();
