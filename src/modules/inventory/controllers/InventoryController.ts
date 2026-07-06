// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateInventoryDto,
  UpdateInventoryDto,
} from '../types/inventory.dto';

import { inventoryService } from '../services';

import {
  validateCreateInventory,
  validateUpdateInventory,
} from '../validation/inventory.validation';

// ==========================================================
// Inventory Controller
// ==========================================================

export class InventoryController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all inventory records.
   */
  async getInventories(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const inventories =
      await inventoryService.getInventories();

    ApiResponse.success(
      res,
      inventories,
    );

  }

  /**
   * Retrieve a single inventory record.
   */
  async getInventory(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const inventory =
      await inventoryService.getInventory(
        req.params.id,
      );

    if (!inventory) {

      ApiResponse.notFound(
        res,
        'Inventory not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      inventory,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createInventory(
    req: Request<
      unknown,
      unknown,
      CreateInventoryDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateInventory(
      req.body,
    );

    const inventory =
      await inventoryService.createInventory(
        req.body,
      );

    ApiResponse.created(
      res,
      inventory,
    );

  }

  async updateInventory(
    req: Request<
      IdParams,
      unknown,
      UpdateInventoryDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateInventory(
      req.body,
    );

    const inventory =
      await inventoryService.updateInventory(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      inventory,
    );

  }

  async deleteInventory(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await inventoryService.deleteInventory(
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

export const inventoryController =
  new InventoryController();
