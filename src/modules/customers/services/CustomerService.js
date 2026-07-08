"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = exports.CustomerService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Customer Service
// ==========================================================
class CustomerService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single customer by its unique identifier.
     */
    async getCustomer(id) {
        return this.db.customer.findUnique({
            where: { id },
        });
    }
    /**
   * Retrieve customers.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getCustomers(options) {
        return this.db.customer.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new customer.
     */
    async createCustomer(dto) {
        const data = {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            telephone: dto.telephone,
            company: dto.company,
        };
        return this.db.customer.create({
            data,
        });
    }
    /**
     * Update an existing customer.
     */
    async updateCustomer(id, dto) {
        const data = {};
        if (dto.firstName !== undefined) {
            data.firstName = dto.firstName;
        }
        if (dto.lastName !== undefined) {
            data.lastName = dto.lastName;
        }
        if (dto.email !== undefined) {
            data.email = dto.email;
        }
        if (dto.telephone !== undefined) {
            data.telephone = dto.telephone;
        }
        if (dto.company !== undefined) {
            data.company = dto.company;
        }
        return this.db.customer.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a customer.
     */
    async deleteCustomer(id) {
        return this.db.customer.delete({
            where: { id },
        });
    }
}
exports.CustomerService = CustomerService;
// ==========================================================
// Service Instance
// ==========================================================
exports.customerService = new CustomerService();
