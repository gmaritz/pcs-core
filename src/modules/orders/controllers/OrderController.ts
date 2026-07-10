// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateOrderDto,
  UpdateOrderDto,
} from '../types/order.dto';

import { orderService } from '../services';

import {
  validateCreateOrder,
  validateUpdateOrder,
} from '../validation/order.validation';

// ==========================================================
// Order Controller
// ==========================================================

export class OrderController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all orders.
   */
  async getOrders(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const orders =
      await orderService.getOrders();

    ApiResponse.success(
      res,
      orders,
    );

  }

  /**
   * Retrieve a single order.
   */
  async getOrder(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const order =
      await orderService.getOrder(
        req.params.id,
      );

    if (!order) {

      ApiResponse.notFound(
        res,
        'Order not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      order,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createOrder(
    req: Request<
      unknown,
      unknown,
      CreateOrderDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateOrder(
      req.body,
    );

    const order =
      await orderService.createOrder(
        req.body,
      );

    ApiResponse.created(
      res,
      order,
    );

  }

  async updateOrder(
    req: Request<
      IdParams,
      unknown,
      UpdateOrderDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateOrder(
      req.body,
    );

    const order =
      await orderService.updateOrder(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      order,
    );

  }

  async deleteOrder(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await orderService.deleteOrder(
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

export const orderController =
  new OrderController();
