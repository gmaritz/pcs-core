// ==========================================================
// Imports
// ==========================================================

import {
  Request,
  Response,
} from 'express';

import { ApiResponse } from '../../../shared/responses';

import {
  ImportProductsDto,
} from '../types';
import {
  supplierImportService,
  SupplierImportServiceError,
} from '../services';
import {
  SupplierImportValidationError,
  validateImportProducts,
} from '../validation';

// ==========================================================
// Supplier Import Controller
// ==========================================================

export class SupplierImportController {

  async importProducts(
    req: Request<
      unknown,
      unknown,
      ImportProductsDto
    >,
    res: Response,
  ): Promise<void> {

    try {

      validateImportProducts(req.body);

      const result = await supplierImportService.importProducts(
        req.body,
      );

      ApiResponse.success(
        res,
        result,
      );

    } catch (error) {

      if (error instanceof SupplierImportValidationError) {

        res.status(400).json({
          message: error.message,
        });

        return;

      }

      if (error instanceof SupplierImportServiceError) {

        res.status(error.statusCode).json({
          message: error.message,
          errors: error.errors,
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

export const supplierImportController =
  new SupplierImportController();
