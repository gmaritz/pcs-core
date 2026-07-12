// ==========================================================
// Imports
// ==========================================================

import {
  CartStatus,
  PaymentChannel,
  Prisma,
} from '@prisma/client';

import { BaseService } from '../../../shared/services/BaseService';
import {
  orderService,
} from '../../../orders/services';
import {
  paymentService,
} from '../../../payments/services';

import {
  CheckoutDto,
  CheckoutResultDto,
} from '../types';

// ==========================================================
// Errors
// ==========================================================

export class CheckoutServiceError extends Error {

  readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
  ) {

    super(message);

    this.name = 'CheckoutServiceError';

    this.statusCode = statusCode;

  }

}

// ==========================================================
// Checkout Service
// ==========================================================

export class CheckoutService extends BaseService {

  async checkout(
    dto: CheckoutDto,
  ): Promise<CheckoutResultDto> {

    return this.db.$transaction(async (tx) => {

      const cart = await tx.cart.findUnique({

        where: {
          id: dto.cartId,
        },

        include: {
          customer: true,
          items: {
            include: {
              productVariant: {
                include: {
                  inventory: true,
                },
              },
            },
          },
        },

      });

      if (!cart) {
        throw new CheckoutServiceError('Cart not found.', 404);
      }

      if (cart.status !== CartStatus.ACTIVE) {
        throw new CheckoutServiceError('Cart must be ACTIVE.', 400);
      }

      if (cart.items.length === 0) {
        throw new CheckoutServiceError('Cart is empty.', 400);
      }

      for (const item of cart.items) {

        const inventories = item.productVariant.inventory;

        const availableQuantity = inventories.reduce(
          (total, inventory) =>
            total + (
              inventory.quantityOnHand -
              inventory.quantityReserved
            ),
          0,
        );

        if (availableQuantity < item.quantity) {
          throw new CheckoutServiceError('Insufficient inventory.', 409);
        }

      }

      const order = await orderService.createOrder(
        {
          customerId: cart.customerId,
          billingAddressId: dto.billingAddressId,
          shippingAddressId: dto.shippingAddressId,
          notes: dto.notes,
        },
        tx,
      );

      const items = await Promise.all(
        cart.items.map((item) =>
          tx.orderItem.create({

            data: {
              orderId: order.id,
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(0),
              totalPrice: new Prisma.Decimal(0),
            },

          }))
      );

      const payment = await paymentService.createPayment(
        {
          orderId: order.id,
          amount: 0,
          method: PaymentChannel.EFT,
          notes: 'Pending payment created by checkout workflow.',
        },
        tx,
      );

      await tx.cart.update({

        where: {
          id: cart.id,
        },

        data: {
          status: CartStatus.CHECKED_OUT,
        },

      });

      return {
        order,
        items,
        payment,
      };

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const checkoutService = new CheckoutService();
