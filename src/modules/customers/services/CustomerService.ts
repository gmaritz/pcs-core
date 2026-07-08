// ==========================================================
// Imports
// ==========================================================

import { Customer, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../types/customer.dto';

// ==========================================================
// Customer Service
// ==========================================================

export class CustomerService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single customer by its unique identifier.
   */
  async getCustomer(
    id: string,
  ): Promise<Customer | null> {

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
  async getCustomers(
    options?: Prisma.CustomerFindManyArgs,
  ): Promise<Customer[]> {

    return this.db.customer.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new customer.
   */
  async createCustomer(
    dto: CreateCustomerDto,
  ): Promise<Customer> {

    const data: Prisma.CustomerCreateInput = {

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
  async updateCustomer(
    id: string,
    dto: UpdateCustomerDto,
  ): Promise<Customer> {

    const data: Prisma.CustomerUpdateInput = {};

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
  async deleteCustomer(
    id: string,
  ): Promise<Customer> {

    return this.db.customer.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const customerService = new CustomerService();
