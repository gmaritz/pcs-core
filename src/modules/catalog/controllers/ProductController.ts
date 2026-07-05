// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateProductDto,
  UpdateProductDto,
} from '../types/product.dto';

import { productService } from '../services';

import {
  validateCreateProduct,
  validateUpdateProduct,
} from '../validation/product.validation';

// ==========================================================
// Product Controller
// ==========================================================

export class ProductController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all products.
   */
  async getProducts(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const products =
      await productService.getProducts();

    ApiResponse.success(
      res,
      products,
    );

  }

  /**
   * Retrieve a single product.
   */
  async getProduct(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const product =
      await productService.getProduct(
        req.params.id,
      );

    if (!product) {

      ApiResponse.notFound(
        res,
        'Product not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      product,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createProduct(
    req: Request<
      unknown,
      unknown,
      CreateProductDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateProduct(
      req.body,
    );

    const product =
      await productService.createProduct(
        req.body,
      );

    ApiResponse.created(
      res,
      product,
    );

  }

  async updateProduct(
    req: Request<
      IdParams,
      unknown,
      UpdateProductDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateProduct(
      req.body,
    );

    const product =
      await productService.updateProduct(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      product,
    );

  }

  async deleteProduct(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await productService.deleteProduct(
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

export const productController =
  new ProductController();