// ==========================================================
// Imports
// ==========================================================

import { Prisma, ProductVariant } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

// ==========================================================
// Product Variant Service
// ==========================================================

export class ProductVariantService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single product variant by its unique identifier.
   */
  async getProductVariant(id: string): Promise<ProductVariant | null> {
    return this.db.productVariant.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Retrieve all product variants ordered by SKU.
   */
  async getProductVariants(): Promise<ProductVariant[]> {
    return this.db.productVariant.findMany({
      orderBy: {
        sku: 'asc',
      },
    });
  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new product variant.
   */
  async createProductVariant(
    data: Prisma.ProductVariantCreateInput,
  ): Promise<ProductVariant> {
    return this.db.productVariant.create({
      data,
    });
  }

  /**
   * Update an existing product variant.
   */
  async updateProductVariant(
    id: string,
    data: Prisma.ProductVariantUpdateInput,
  ): Promise<ProductVariant> {
    return this.db.productVariant.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Delete a product variant.
   */
  async deleteProductVariant(id: string): Promise<ProductVariant> {
    return this.db.productVariant.delete({
      where: {
        id,
      },
    });
  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const productVariantService = new ProductVariantService();