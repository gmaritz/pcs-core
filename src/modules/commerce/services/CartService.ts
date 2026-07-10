// ==========================================================
// Imports
// ==========================================================

import { Cart, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  CreateCartDto,
  UpdateCartDto,
} from '../types/cart.dto';

// ==========================================================
// Cart Service
// ==========================================================

export class CartService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single cart by its unique identifier.
   */
  async getCart(
    id: string,
  ): Promise<Cart | null> {

    return this.db.cart.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve carts.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getCarts(
    options?: Prisma.CartFindManyArgs,
  ): Promise<Cart[]> {

    return this.db.cart.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new cart.
   */
  async createCart(
    dto: CreateCartDto,
  ): Promise<Cart> {

    const data: Prisma.CartCreateInput = {

      customer: {
        connect: {
          id: dto.customerId,
        },
      },

    };

    return this.db.cart.create({

      data,

    });

  }

  /**
   * Update an existing cart.
   */
  async updateCart(
    id: string,
    dto: UpdateCartDto,
  ): Promise<Cart> {

    const data: Prisma.CartUpdateInput = {};

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return this.db.cart.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a cart.
   */
  async deleteCart(
    id: string,
  ): Promise<Cart> {

    return this.db.cart.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const cartService = new CartService();
