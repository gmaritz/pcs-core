// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../types/customer.dto';

import { customerService } from '../services';

import {
  validateCreateCustomer,
  validateUpdateCustomer,
} from '../validation/customer.validation';

// ==========================================================
// Customer Controller
// ==========================================================

export class CustomerController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all customers.
   */
  async getCustomers(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const customers =
      await customerService.getCustomers();

    ApiResponse.success(
      res,
      customers,
    );

  }

  /**
   * Retrieve a single customer.
   */
  async getCustomer(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const customer =
      await customerService.getCustomer(
        req.params.id,
      );

    if (!customer) {

      ApiResponse.notFound(
        res,
        'Customer not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      customer,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createCustomer(
    req: Request<
      unknown,
      unknown,
      CreateCustomerDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateCustomer(
      req.body,
    );

    const customer =
      await customerService.createCustomer(
        req.body,
      );

    ApiResponse.created(
      res,
      customer,
    );

  }

  async updateCustomer(
    req: Request<
      IdParams,
      unknown,
      UpdateCustomerDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateCustomer(
      req.body,
    );

    const customer =
      await customerService.updateCustomer(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      customer,
    );

  }

  async deleteCustomer(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await customerService.deleteCustomer(
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

export const customerController =
  new CustomerController();
