// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../types/product-variant.dto';

import { productVariantService } from '../services';

import {
  validateCreateProductVariant,
  validateUpdateProductVariant,
} from '../validation/product-variant.validation';

// ==========================================================
// Product Variant Controller
// ==========================================================

export class ProductVariantController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all product variants.
   */
  async getProductVariants(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const variants =
      await productVariantService.getProductVariants();

    ApiResponse.success(
      res,
      variants,
    );

  }

  /**
   * Retrieve a single product variant.
   */
  async getProductVariant(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const variant =
      await productVariantService.getProductVariant(
        req.params.id,
      );

    if (!variant) {

      ApiResponse.notFound(
        res,
        'Product variant not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      variant,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createProductVariant(
    req: Request<
      unknown,
      unknown,
      CreateProductVariantDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateProductVariant(
      req.body,
    );

    const variant =
      await productVariantService.createProductVariant(
        req.body,
      );

    ApiResponse.created(
      res,
      variant,
    );

  }

  async updateProductVariant(
    req: Request<
      IdParams,
      unknown,
      UpdateProductVariantDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateProductVariant(
      req.body,
    );

    const variant =
      await productVariantService.updateProductVariant(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      variant,
    );

  }

  async deleteProductVariant(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await productVariantService.deleteProductVariant(
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

export const productVariantController =
  new ProductVariantController();