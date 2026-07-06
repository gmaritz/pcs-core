// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateSupplierDto,
  UpdateSupplierDto,
} from '../types/supplier.dto';

import { supplierService } from '../services';

import {
  validateCreateSupplier,
  validateUpdateSupplier,
} from '../validation/supplier.validation';

// ==========================================================
// Supplier Controller
// ==========================================================

export class SupplierController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all suppliers.
   */
  async getSuppliers(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const suppliers =
      await supplierService.getSuppliers();

    ApiResponse.success(
      res,
      suppliers,
    );

  }

  /**
   * Retrieve a single supplier.
   */
  async getSupplier(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const supplier =
      await supplierService.getSupplier(
        req.params.id,
      );

    if (!supplier) {

      ApiResponse.notFound(
        res,
        'Supplier not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      supplier,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createSupplier(
    req: Request<
      unknown,
      unknown,
      CreateSupplierDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateSupplier(
      req.body,
    );

    const supplier =
      await supplierService.createSupplier(
        req.body,
      );

    ApiResponse.created(
      res,
      supplier,
    );

  }

  async updateSupplier(
    req: Request<
      IdParams,
      unknown,
      UpdateSupplierDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateSupplier(
      req.body,
    );

    const supplier =
      await supplierService.updateSupplier(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      supplier,
    );

  }

  async deleteSupplier(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await supplierService.deleteSupplier(
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

export const supplierController =
  new SupplierController();
