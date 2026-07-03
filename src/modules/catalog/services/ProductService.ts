// ==========================================================
// Imports
// ==========================================================

import { Prisma, Product } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

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
  async getProduct(id: string): Promise<Product | null> {
    return this.db.product.findUnique({
      where: {
        id,
      },
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
    data: Prisma.ProductCreateInput,
  ): Promise<Product> {
    return this.db.product.create({
      data,
    });
  }

  /**
   * Update an existing product.
   */
  async updateProduct(
    id: string,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return this.db.product.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Delete a product.
   */
  async deleteProduct(id: string): Promise<Product> {
    return this.db.product.delete({
      where: {
        id,
      },
    });
  }

}

 // ==========================================================
 // Service Instance
 // ==========================================================

export const productService = new ProductService();