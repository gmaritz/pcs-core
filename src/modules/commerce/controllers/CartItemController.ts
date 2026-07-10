// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateCartItemDto,
  UpdateCartItemDto,
} from '../types/cart-item.dto';

import { cartItemService } from '../services';

import {
  validateCreateCartItem,
  validateUpdateCartItem,
} from '../validation/cart-item.validation';

// ==========================================================
// Cart Item Controller
// ==========================================================

export class CartItemController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all cart items.
   */
  async getCartItems(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const cartItems =
      await cartItemService.getCartItems();

    ApiResponse.success(
      res,
      cartItems,
    );

  }

  /**
   * Retrieve a single cart item.
   */
  async getCartItem(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const cartItem =
      await cartItemService.getCartItem(
        req.params.id,
      );

    if (!cartItem) {

      ApiResponse.notFound(
        res,
        'Cart Item not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      cartItem,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createCartItem(
    req: Request<
      unknown,
      unknown,
      CreateCartItemDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateCartItem(
      req.body,
    );

    const cartItem =
      await cartItemService.createCartItem(
        req.body,
      );

    ApiResponse.created(
      res,
      cartItem,
    );

  }

  async updateCartItem(
    req: Request<
      IdParams,
      unknown,
      UpdateCartItemDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateCartItem(
      req.body,
    );

    const cartItem =
      await cartItemService.updateCartItem(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      cartItem,
    );

  }

  async deleteCartItem(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await cartItemService.deleteCartItem(
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

export const cartItemController =
  new CartItemController();
