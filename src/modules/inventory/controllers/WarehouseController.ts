// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from '../types/warehouse.dto';

import { warehouseService } from '../services';

import {
  validateCreateWarehouse,
  validateUpdateWarehouse,
} from '../validation/warehouse.validation';

// ==========================================================
// Warehouse Controller
// ==========================================================

export class WarehouseController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all warehouses.
   */
  async getWarehouses(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const warehouses =
      await warehouseService.getWarehouses();

    ApiResponse.success(
      res,
      warehouses,
    );

  }

  /**
   * Retrieve a single warehouse.
   */
  async getWarehouse(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const warehouse =
      await warehouseService.getWarehouse(
        req.params.id,
      );

    if (!warehouse) {

      ApiResponse.notFound(
        res,
        'Warehouse not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      warehouse,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createWarehouse(
    req: Request<
      unknown,
      unknown,
      CreateWarehouseDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateWarehouse(
      req.body,
    );

    const warehouse =
      await warehouseService.createWarehouse(
        req.body,
      );

    ApiResponse.created(
      res,
      warehouse,
    );

  }

  async updateWarehouse(
    req: Request<
      IdParams,
      unknown,
      UpdateWarehouseDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateWarehouse(
      req.body,
    );

    const warehouse =
      await warehouseService.updateWarehouse(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      warehouse,
    );

  }

  async deleteWarehouse(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await warehouseService.deleteWarehouse(
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

export const warehouseController =
  new WarehouseController();