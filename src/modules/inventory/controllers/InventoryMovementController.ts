// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateInventoryMovementDto,
  UpdateInventoryMovementDto,
} from '../types/inventory-movement.dto';

import { inventoryMovementService } from '../services';

import {
  validateCreateInventoryMovement,
  validateUpdateInventoryMovement,
} from '../validation/inventory-movement.validation';

// ==========================================================
// Inventory Movement Controller
// ==========================================================

export class InventoryMovementController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all inventory movements.
   */
  async getInventoryMovements(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const inventoryMovements =
      await inventoryMovementService.getInventoryMovements();

    ApiResponse.success(
      res,
      inventoryMovements,
    );

  }

  /**
   * Retrieve a single inventory movement.
   */
  async getInventoryMovement(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const inventoryMovement =
      await inventoryMovementService.getInventoryMovement(
        req.params.id,
      );

    if (!inventoryMovement) {

      ApiResponse.notFound(
        res,
        'Inventory Movement not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      inventoryMovement,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createInventoryMovement(
    req: Request<
      unknown,
      unknown,
      CreateInventoryMovementDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateInventoryMovement(
      req.body,
    );

    const inventoryMovement =
      await inventoryMovementService.createInventoryMovement(
        req.body,
      );

    ApiResponse.created(
      res,
      inventoryMovement,
    );

  }

  async updateInventoryMovement(
    req: Request<
      IdParams,
      unknown,
      UpdateInventoryMovementDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateInventoryMovement(
      req.body,
    );

    const inventoryMovement =
      await inventoryMovementService.updateInventoryMovement(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      inventoryMovement,
    );

  }

  async deleteInventoryMovement(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await inventoryMovementService.deleteInventoryMovement(
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

export const inventoryMovementController =
  new InventoryMovementController();