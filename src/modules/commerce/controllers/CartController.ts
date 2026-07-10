// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateCartDto,
  UpdateCartDto,
} from '../types/cart.dto';

import { cartService } from '../services';

import {
  validateCreateCart,
  validateUpdateCart,
} from '../validation/cart.validation';

// ==========================================================
// Cart Controller
// ==========================================================

export class CartController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all carts.
   */
  async getCarts(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const carts =
      await cartService.getCarts();

    ApiResponse.success(
      res,
      carts,
    );

  }

  /**
   * Retrieve a single cart.
   */
  async getCart(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const cart =
      await cartService.getCart(
        req.params.id,
      );

    if (!cart) {

      ApiResponse.notFound(
        res,
        'Cart not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      cart,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createCart(
    req: Request<
      unknown,
      unknown,
      CreateCartDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateCart(
      req.body,
    );

    const cart =
      await cartService.createCart(
        req.body,
      );

    ApiResponse.created(
      res,
      cart,
    );

  }

  async updateCart(
    req: Request<
      IdParams,
      unknown,
      UpdateCartDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateCart(
      req.body,
    );

    const cart =
      await cartService.updateCart(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      cart,
    );

  }

  async deleteCart(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await cartService.deleteCart(
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

export const cartController =
  new CartController();
