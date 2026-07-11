// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateProductMediaDto,
  UpdateProductMediaDto,
} from '../types/product-media.dto';

import { productMediaService } from '../services';

import {
  validateCreateProductMedia,
  validateUpdateProductMedia,
} from '../validation/product-media.validation';

// ==========================================================
// Product Media Controller
// ==========================================================

export class ProductMediaController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all product media records.
   */
  async getProductMedia(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const productMedia =
      await productMediaService.getProductMedia();

    ApiResponse.success(
      res,
      productMedia,
    );

  }

  /**
   * Retrieve a single product media record.
   */
  async getProductMediaItem(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const productMedia =
      await productMediaService.getProductMediaItem(
        req.params.id,
      );

    if (!productMedia) {

      ApiResponse.notFound(
        res,
        'Product Media not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      productMedia,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createProductMedia(
    req: Request<
      unknown,
      unknown,
      CreateProductMediaDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateProductMedia(
      req.body,
    );

    const productMedia =
      await productMediaService.createProductMedia(
        req.body,
      );

    ApiResponse.created(
      res,
      productMedia,
    );

  }

  async updateProductMedia(
    req: Request<
      IdParams,
      unknown,
      UpdateProductMediaDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateProductMedia(
      req.body,
    );

    const productMedia =
      await productMediaService.updateProductMedia(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      productMedia,
    );

  }

  async deleteProductMedia(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await productMediaService.deleteProductMedia(
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

export const productMediaController =
  new ProductMediaController();
