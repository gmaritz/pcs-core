// ==========================================================
// Imports
// ==========================================================

import { Prisma, Product } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  productCodeService,
  slugService,
} from '../../shared/services';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../types/product.dto';

// ==========================================================
// Product Service
// ==========================================================

export class ProductService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single product by its unique identifier.
   */
  async getProduct(
    id: string,
  ): Promise<Product | null> {

    return this.db.product.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve products.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getProducts(
    options?: Prisma.ProductFindManyArgs,
  ): Promise<Product[]> {

    return this.db.product.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new product.
   */
  async createProduct(
    dto: CreateProductDto,
  ): Promise<Product> {

    const slug = slugService.generate(
      dto.name,
    );

    const code = productCodeService.generate(
      dto.name,
    );

    const data: Prisma.ProductCreateInput = {

      name: dto.name,

      code,

      slug,

      description: dto.description,

      displayOrder:
        dto.displayOrder ?? 0,

      sport: {
        connect: {
          id: dto.sportId,
        },
      },

      brand: {
        connect: {
          id: dto.brandId,
        },
      },

      category: {
        connect: {
          id: dto.categoryId,
        },
      },

    };

    return this.db.product.create({

      data,

    });

  }

  /**
   * Update an existing product.
   */
  async updateProduct(
    id: string,
    dto: UpdateProductDto,
  ): Promise<Product> {

    const data: Prisma.ProductUpdateInput = {};

    if (dto.name !== undefined) {

      data.name = dto.name;

      data.slug = slugService.generate(
        dto.name,
      );

      data.code = productCodeService.generate(
        dto.name,
      );

    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    if (dto.sportId !== undefined) {

      data.sport = {
        connect: {
          id: dto.sportId,
        },
      };

    }

    if (dto.brandId !== undefined) {

      data.brand = {
        connect: {
          id: dto.brandId,
        },
      };

    }

    if (dto.categoryId !== undefined) {

      data.category = {
        connect: {
          id: dto.categoryId,
        },
      };

    }

    return this.db.product.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a product.
   */
  async deleteProduct(id: string): Promise<Product> {
    return this.db.product.delete({

      where: { id },

    });
  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const productService = new ProductService();