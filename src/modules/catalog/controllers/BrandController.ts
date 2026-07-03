// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import {
  CreateBrandDto,
  UpdateBrandDto,
} from '../types/brand.dto';
import { brandService } from '../services';
import {
  validateCreateBrand,
  validateUpdateBrand,
} from '../validation/brand.validation';

// ==========================================================
// Brand Controller
// ==========================================================

export class BrandController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all brands.
   */
  async getBrands(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const brands = await brandService.getBrands();

    res.status(200).json(brands);

  }

  /**
   * Retrieve a single brand.
   */
  async getBrand(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const brand = await brandService.getBrand(req.params.id);

    if (!brand) {
      res.status(404).json({
        message: 'Brand not found.',
      });
      return;
    }

    res.status(200).json(brand);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new brand.
   */
  async createBrand(
    req: Request<unknown, unknown, CreateBrandDto>,
    res: Response,
  ): Promise<void> {

    validateCreateBrand(req.body);

    const brand = await brandService.createBrand(req.body);

    res.status(201).json(brand);

  }

  /**
   * Update an existing brand.
   */
  async updateBrand(
    req: Request<IdParams, unknown, UpdateBrandDto>,
    res: Response,
  ): Promise<void> {

    validateUpdateBrand(req.body);

    const brand = await brandService.updateBrand(
      req.params.id,
      req.body,
    );

    res.status(200).json(brand);

  }

  /**
   * Delete a brand.
   */
  async deleteBrand(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await brandService.deleteBrand(req.params.id);

    res.sendStatus(204);

  }

}

// ==========================================================
// Controller Instance
// ==========================================================

export const brandController = new BrandController();