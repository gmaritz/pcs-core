// ==========================================================
// Imports
// ==========================================================

import {
  Request,
  Response,
} from 'express';

import { ApiResponse } from '../../../shared/responses';

import {
  SupplierImportServiceError,
} from '../../supplier-feed-import/services';
import {
  supplierAdapterService,
  SupplierAdapterServiceError,
} from '../services';
import {
  ImportJsonProductsDto,
} from '../types';
import {
  SupplierAdapterValidationError,
  validateImportJson,
} from '../validation';

// ==========================================================
// Supplier Adapter Controller
// ==========================================================

export class SupplierAdapterController {

  async importJson(
    req: Request<
      unknown,
      unknown,
      ImportJsonProductsDto
    >,
    res: Response,
  ): Promise<void> {

    try {

      validateImportJson(req.body);

      const result = await supplierAdapterService.importJson(
        req.body,
      );

      ApiResponse.success(
        res,
        result,
      );

    } catch (error) {

      if (error instanceof SupplierAdapterValidationError) {

        res.status(400).json({
          message: error.message,
        });

        return;

      }

      if (error instanceof SupplierAdapterServiceError) {

        res.status(error.statusCode).json({
          message: error.message,
          errors: error.errors,
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

export const supplierAdapterController =
  new SupplierAdapterController();
