"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Payment Service
// ==========================================================
class PaymentService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single payment by its unique identifier.
     */
    async getPayment(id) {
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
    async getPayments(options) {
        return this.db.payment.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new payment.
     */
    async createPayment(dto) {
        const paymentReference = await this.generatePaymentReference();
        const data = {
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
        return this.db.payment.create({
            data,
        });
    }
    /**
     * Update an existing payment.
     */
    async updatePayment(id, dto) {
        const data = {};
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
    async deletePayment(id) {
        return this.db.payment.delete({
            where: { id },
        });
    }
    // ========================================================
    // Private Helpers
    // ========================================================
    async generatePaymentReference() {
        const latestPayment = await this.db.payment.findFirst({
            select: {
                paymentReference: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const latestSequence = latestPayment
            ? Number.parseInt(latestPayment.paymentReference.replace('PAY-', ''), 10)
            : 0;
        const nextSequence = Number.isNaN(latestSequence)
            ? 1
            : latestSequence + 1;
        return `PAY-${nextSequence.toString().padStart(6, '0')}`;
    }
}
exports.PaymentService = PaymentService;
// ==========================================================
// Service Instance
// ==========================================================
exports.paymentService = new PaymentService();
