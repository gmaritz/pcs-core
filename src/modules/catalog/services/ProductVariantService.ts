// ==========================================================
// Imports
// ==========================================================

import { Prisma, ProductVariant } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import { slugService } from '../../shared/services';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../types/product-variant.dto';

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
  async getProductVariant(
    id: string,
  ): Promise<ProductVariant | null> {

    return this.db.productVariant.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve product variants.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getProductVariants(
    options?: Prisma.ProductVariantFindManyArgs,
  ): Promise<ProductVariant[]> {

    return this.db.productVariant.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new product variant.
   */
  async createProductVariant(
    dto: CreateProductVariantDto,
  ): Promise<ProductVariant> {

    const slug = slugService.generate(
      dto.name,
    );

    const sku = dto.name
      .substring(0, 3)
      .toUpperCase();

    const data: Prisma.ProductVariantCreateInput = {

      name: dto.name,

      sku,

      slug,

      description: dto.description,

      displayOrder:
        dto.displayOrder ?? 0,

      product: {
        connect: {
          id: dto.productId,
        },
      },

    };

    return this.db.productVariant.create({

      data,

    });

  }

  /**
   * Update an existing product variant.
   */
  async updateProductVariant(
    id: string,
    dto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {

    const data: Prisma.ProductVariantUpdateInput = {};

    if (dto.name !== undefined) {

      data.name = dto.name;

      data.slug = slugService.generate(
        dto.name,
      );

      // SKU remains unchanged once created.

    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    if (dto.productId !== undefined) {

      data.product = {
        connect: {
          id: dto.productId,
        },
      };

    }

    return this.db.productVariant.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a product variant.
   */
  async deleteProductVariant(id: string): Promise<ProductVariant> {
    return this.db.productVariant.delete({

      where: { id },

    });
  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const productVariantService = new ProductVariantService();