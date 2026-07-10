// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from '../types/order-item.dto';

import { orderItemService } from '../services';

import {
  validateCreateOrderItem,
  validateUpdateOrderItem,
} from '../validation/order-item.validation';

// ==========================================================
// Order Item Controller
// ==========================================================

export class OrderItemController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all order items.
   */
  async getOrderItems(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const orderItems =
      await orderItemService.getOrderItems();

    ApiResponse.success(
      res,
      orderItems,
    );

  }

  /**
   * Retrieve a single order item.
   */
  async getOrderItem(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const orderItem =
      await orderItemService.getOrderItem(
        req.params.id,
      );

    if (!orderItem) {

      ApiResponse.notFound(
        res,
        'Order Item not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      orderItem,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createOrderItem(
    req: Request<
      unknown,
      unknown,
      CreateOrderItemDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateOrderItem(
      req.body,
    );

    const orderItem =
      await orderItemService.createOrderItem(
        req.body,
      );

    ApiResponse.created(
      res,
      orderItem,
    );

  }

  async updateOrderItem(
    req: Request<
      IdParams,
      unknown,
      UpdateOrderItemDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateOrderItem(
      req.body,
    );

    const orderItem =
      await orderItemService.updateOrderItem(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      orderItem,
    );

  }

  async deleteOrderItem(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await orderItemService.deleteOrderItem(
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

export const orderItemController =
  new OrderItemController();
