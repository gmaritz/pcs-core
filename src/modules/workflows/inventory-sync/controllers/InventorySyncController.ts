// ==========================================================
// Imports
// ==========================================================

import {
  Request,
  Response,
} from 'express';

import { ApiResponse } from '../../../shared/responses';

import {
  SynchroniseInventoryDto,
} from '../types';
import {
  inventorySyncService,
  InventorySyncServiceError,
} from '../services';
import {
  InventorySyncValidationError,
  validateSynchroniseInventory,
} from '../validation';

// ==========================================================
// Inventory Sync Controller
// ==========================================================

export class InventorySyncController {

  async synchronise(
    req: Request<
      unknown,
      unknown,
      SynchroniseInventoryDto
    >,
    res: Response,
  ): Promise<void> {

    try {

      validateSynchroniseInventory(req.body);

      const result = await inventorySyncService.synchronise(
        req.body,
      );

      ApiResponse.success(
        res,
        result,
      );

    } catch (error) {

      if (error instanceof InventorySyncValidationError) {

        res.status(400).json({
          message: error.message,
        });

        return;

      }

      if (error instanceof InventorySyncServiceError) {

        res.status(error.statusCode).json({
          message: error.message,
        });

        return;

      }

      throw error;

    }

  }

}

export const inventorySyncController =
  new InventorySyncController();
