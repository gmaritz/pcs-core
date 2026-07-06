// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateSupplierProductDto,
  UpdateSupplierProductDto,
} from '../types/supplier-product.dto';

import { supplierProductService } from '../services';

import {
  validateCreateSupplierProduct,
  validateUpdateSupplierProduct,
} from '../validation/supplier-product.validation';

// ==========================================================
// Supplier Product Controller
// ==========================================================

export class SupplierProductController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all supplier products.
   */
  async getSupplierProducts(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const supplierProducts =
      await supplierProductService.getSupplierProducts();

    ApiResponse.success(
      res,
      supplierProducts,
    );

  }

  /**
   * Retrieve a single supplier product.
   */
  async getSupplierProduct(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const supplierProduct =
      await supplierProductService.getSupplierProduct(
        req.params.id,
      );

    if (!supplierProduct) {

      ApiResponse.notFound(
        res,
        'Supplier Product not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      supplierProduct,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createSupplierProduct(
    req: Request<
      unknown,
      unknown,
      CreateSupplierProductDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateSupplierProduct(
      req.body,
    );

    const supplierProduct =
      await supplierProductService.createSupplierProduct(
        req.body,
      );

    ApiResponse.created(
      res,
      supplierProduct,
    );

  }

  async updateSupplierProduct(
    req: Request<
      IdParams,
      unknown,
      UpdateSupplierProductDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateSupplierProduct(
      req.body,
    );

    const supplierProduct =
      await supplierProductService.updateSupplierProduct(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      supplierProduct,
    );

  }

  async deleteSupplierProduct(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await supplierProductService.deleteSupplierProduct(
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

export const supplierProductController =
  new SupplierProductController();
