// ==========================================================
// Imports
// ==========================================================

import {
  Payment,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from '../types/payment.dto';

// ==========================================================
// Payment Service
// ==========================================================

export class PaymentService extends BaseService {

  private readonly defaultDbClient: PrismaClient = this.db;

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single payment by its unique identifier.
   */
  async getPayment(
    id: string,
  ): Promise<Payment | null> {

    return this.db.payment.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve payments.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getPayments(
    options?: Prisma.PaymentFindManyArgs,
  ): Promise<Payment[]> {

    return this.db.payment.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new payment.
   */
  async createPayment(
    dto: CreatePaymentDto,
    dbClient?: Prisma.TransactionClient,
  ): Promise<Payment> {

    const client = dbClient ?? this.defaultDbClient;

    const paymentReference = await this.generatePaymentReference(
      client,
    );

    const data: Prisma.PaymentCreateInput = {

      paymentReference,

      amount: dto.amount,

      currency: dto.currency,

      method: dto.method,

      transactionReference: dto.transactionReference,

      notes: dto.notes,

      order: {
        connect: {
          id: dto.orderId,
        },
      },

    };

    return client.payment.create({

      data,

    });

  }

  /**
   * Update an existing payment.
   */
  async updatePayment(
    id: string,
    dto: UpdatePaymentDto,
  ): Promise<Payment> {

    const data: Prisma.PaymentUpdateInput = {};

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (dto.transactionReference !== undefined) {
      data.transactionReference = dto.transactionReference;
    }

    if (dto.notes !== undefined) {
      data.notes = dto.notes;
    }

    return this.db.payment.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a payment.
   */
  async deletePayment(
    id: string,
  ): Promise<Payment> {

    return this.db.payment.delete({

      where: { id },

    });

  }

  // ========================================================
  // Private Helpers
  // ========================================================

  async generatePaymentReference(
    dbClient?: Prisma.TransactionClient,
  ): Promise<string> {

    const client = dbClient ?? this.defaultDbClient;

    const latestPayment = await client.payment.findFirst({

      select: {
        paymentReference: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

    });

    const latestSequence = latestPayment
      ? Number.parseInt(
        latestPayment.paymentReference.replace('PAY-', ''),
        10,
      )
      : 0;

    const nextSequence = Number.isNaN(latestSequence)
      ? 1
      : latestSequence + 1;

    return `PAY-${nextSequence.toString().padStart(6, '0')}`;

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const paymentService = new PaymentService();
