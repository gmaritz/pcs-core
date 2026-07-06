// ==========================================================
// Imports
// ==========================================================

import { Prisma, SupplierProduct } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

import {
  CreateSupplierProductDto,
  UpdateSupplierProductDto,
} from '../types/supplier-product.dto';

// ==========================================================
// Supplier Product Service
// ==========================================================

export class SupplierProductService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single supplier product by its unique identifier.
   */
  async getSupplierProduct(
    id: string,
  ): Promise<SupplierProduct | null> {

    return this.db.supplierProduct.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve supplier products.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getSupplierProducts(
    options?: Prisma.SupplierProductFindManyArgs,
  ): Promise<SupplierProduct[]> {

    return this.db.supplierProduct.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new supplier product.
   */
  async createSupplierProduct(
    dto: CreateSupplierProductDto,
  ): Promise<SupplierProduct> {

    const data: Prisma.SupplierProductCreateInput = {

      supplierSku: dto.supplierSku,

      supplierProductName: dto.supplierProductName,

      supplierPrice: dto.supplierPrice,

      currency: dto.currency ?? 'ZAR',

      active: dto.active ?? true,

      supplier: {
        connect: {
          id: dto.supplierId,
        },
      },

      productVariant: {
        connect: {
          id: dto.productVariantId,
        },
      },

    };

    return this.db.supplierProduct.create({

      data,

    });

  }

  /**
   * Update an existing supplier product.
   */
  async updateSupplierProduct(
    id: string,
    dto: UpdateSupplierProductDto,
  ): Promise<SupplierProduct> {

    const data: Prisma.SupplierProductUpdateInput = {};

    if (dto.supplierSku !== undefined) {
      data.supplierSku = dto.supplierSku;
    }

    if (dto.supplierProductName !== undefined) {
      data.supplierProductName = dto.supplierProductName;
    }

    if (dto.supplierPrice !== undefined) {
      data.supplierPrice = dto.supplierPrice;
    }

    if (dto.currency !== undefined) {
      data.currency = dto.currency;
    }

    if (dto.active !== undefined) {
      data.active = dto.active;
    }

    if (dto.supplierId !== undefined) {
      data.supplier = {
        connect: {
          id: dto.supplierId,
        },
      };
    }

    if (dto.productVariantId !== undefined) {
      data.productVariant = {
        connect: {
          id: dto.productVariantId,
        },
      };
    }

    return this.db.supplierProduct.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a supplier product.
   */
  async deleteSupplierProduct(
    id: string,
  ): Promise<SupplierProduct> {

    return this.db.supplierProduct.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const supplierProductService =
  new SupplierProductService();
