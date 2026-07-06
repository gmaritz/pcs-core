// ==========================================================
// Imports
// ==========================================================

import { Prisma, Supplier } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import { slugService } from '../../shared/services';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
} from '../types/supplier.dto';

// ==========================================================
// Supplier Service
// ==========================================================

export class SupplierService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single supplier by its unique identifier.
   */
  async getSupplier(
    id: string,
  ): Promise<Supplier | null> {

    return this.db.supplier.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve suppliers.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getSuppliers(
    options?: Prisma.SupplierFindManyArgs,
  ): Promise<Supplier[]> {

    return this.db.supplier.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new supplier.
   */
  async createSupplier(
    dto: CreateSupplierDto,
  ): Promise<Supplier> {

    const slug = slugService.generate(
      dto.name,
    );

    // TODO:
    // Replace with unique supplier code generation once
    // Supplier numbering strategy is implemented.
    const code = dto.name
      .substring(0, 3)
      .toUpperCase();

    const data: Prisma.SupplierCreateInput = {

      name: dto.name,

      code,

      slug,

      description: dto.description,

      website: dto.website,

      email: dto.email,

      telephone: dto.telephone,

      displayOrder:
        dto.displayOrder ?? 0,

    };

    return this.db.supplier.create({

      data,

    });

  }

  /**
   * Update an existing supplier.
   */
  async updateSupplier(
    id: string,
    dto: UpdateSupplierDto,
  ): Promise<Supplier> {

    const data: Prisma.SupplierUpdateInput = {};

    if (dto.name !== undefined) {

      data.name = dto.name;

      data.slug = slugService.generate(
        dto.name,
      );

      // NOTE:
      // Supplier codes remain unchanged once created.

    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.website !== undefined) {
      data.website = dto.website;
    }

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.telephone !== undefined) {
      data.telephone = dto.telephone;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    return this.db.supplier.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a supplier.
   */
  async deleteSupplier(
    id: string,
  ): Promise<Supplier> {

    return this.db.supplier.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const supplierService = new SupplierService();
