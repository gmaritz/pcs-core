// ==========================================================
// Imports
// ==========================================================

import { CartItem, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  CreateCartItemDto,
  UpdateCartItemDto,
} from '../types/cart-item.dto';

// ==========================================================
// Cart Item Service
// ==========================================================

export class CartItemService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single cart item by its unique identifier.
   */
  async getCartItem(
    id: string,
  ): Promise<CartItem | null> {

    return this.db.cartItem.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve cart items.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getCartItems(
    options?: Prisma.CartItemFindManyArgs,
  ): Promise<CartItem[]> {

    return this.db.cartItem.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new cart item.
   */
  async createCartItem(
    dto: CreateCartItemDto,
  ): Promise<CartItem> {

    const data: Prisma.CartItemCreateInput = {

      quantity: dto.quantity,

      cart: {
        connect: {
          id: dto.cartId,
        },
      },

      productVariant: {
        connect: {
          id: dto.productVariantId,
        },
      },

    };

    return this.db.cartItem.create({

      data,

    });

  }

  /**
   * Update an existing cart item.
   */
  async updateCartItem(
    id: string,
    dto: UpdateCartItemDto,
  ): Promise<CartItem> {

    const data: Prisma.CartItemUpdateInput = {};

    if (dto.quantity !== undefined) {
      data.quantity = dto.quantity;
    }

    return this.db.cartItem.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a cart item.
   */
  async deleteCartItem(
    id: string,
  ): Promise<CartItem> {

    return this.db.cartItem.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const cartItemService = new CartItemService();
