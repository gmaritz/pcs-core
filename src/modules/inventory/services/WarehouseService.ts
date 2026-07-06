// ==========================================================
// Imports
// ==========================================================

import { Prisma, Warehouse } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import { slugService } from '../../shared/services';

import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from '../types/warehouse.dto';

// ==========================================================
// Warehouse Service
// ==========================================================

export class WarehouseService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single warehouse by its unique identifier.
   */
  async getWarehouse(
    id: string,
  ): Promise<Warehouse | null> {

    return this.db.warehouse.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve warehouses.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getWarehouses(
    options?: Prisma.WarehouseFindManyArgs,
  ): Promise<Warehouse[]> {

    return this.db.warehouse.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new warehouse.
   */
  async createWarehouse(
    dto: CreateWarehouseDto,
  ): Promise<Warehouse> {

    const slug = slugService.generate(
      dto.name,
    );

    // TODO:
    // Replace with unique warehouse code generation once
    // Warehouse numbering strategy is implemented.
    const code = dto.name
      .substring(0, 3)
      .toUpperCase();

    const data: Prisma.WarehouseCreateInput = {

      name: dto.name,

      code,

      slug,

      description: dto.description,

      addressLine1: dto.addressLine1,

      addressLine2: dto.addressLine2,

      suburb: dto.suburb,

      city: dto.city,

      province: dto.province,

      postalCode: dto.postalCode,

      country: dto.country,

      contactName: dto.contactName,

      contactEmail: dto.contactEmail,

      contactPhone: dto.contactPhone,

      displayOrder: dto.displayOrder ?? 0,

    };

    return this.db.warehouse.create({

      data,

    });

  }

  /**
   * Update an existing warehouse.
   */
  async updateWarehouse(
    id: string,
    dto: UpdateWarehouseDto,
  ): Promise<Warehouse> {

    const data: Prisma.WarehouseUpdateInput = {};

    if (dto.name !== undefined) {

      data.name = dto.name;

      data.slug = slugService.generate(
        dto.name,
      );

      // NOTE:
      // Warehouse codes remain unchanged once created.

    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.addressLine1 !== undefined) {
      data.addressLine1 = dto.addressLine1;
    }

    if (dto.addressLine2 !== undefined) {
      data.addressLine2 = dto.addressLine2;
    }

    if (dto.suburb !== undefined) {
      data.suburb = dto.suburb;
    }

    if (dto.city !== undefined) {
      data.city = dto.city;
    }

    if (dto.province !== undefined) {
      data.province = dto.province;
    }

    if (dto.postalCode !== undefined) {
      data.postalCode = dto.postalCode;
    }

    if (dto.country !== undefined) {
      data.country = dto.country;
    }

    if (dto.contactName !== undefined) {
      data.contactName = dto.contactName;
    }

    if (dto.contactEmail !== undefined) {
      data.contactEmail = dto.contactEmail;
    }

    if (dto.contactPhone !== undefined) {
      data.contactPhone = dto.contactPhone;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    return this.db.warehouse.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a warehouse.
   */
  async deleteWarehouse(
    id: string,
  ): Promise<Warehouse> {

    return this.db.warehouse.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const warehouseService =
  new WarehouseService();