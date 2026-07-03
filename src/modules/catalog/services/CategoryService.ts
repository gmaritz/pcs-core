// ==========================================================
// Imports
// ==========================================================

import { Category, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

// ==========================================================
// Category Service
// ==========================================================

export class CategoryService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single category by its unique identifier.
   */
  async getCategory(id: string): Promise<Category | null> {
    return this.db.category.findUnique({
      where: {
        id,
      },
    });
  }

  /**
 * Retrieve categories.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
async getCategories(
  options?: Prisma.CategoryFindManyArgs,
): Promise<Category[]> {

  return this.db.category.findMany(options);

}

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new category.
   */
  async createCategory(
    data: Prisma.CategoryCreateInput,
  ): Promise<Category> {
    return this.db.category.create({
      data,
    });
  }

  /**
   * Update an existing category.
   */
  async updateCategory(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return this.db.category.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Delete a category.
   */
  async deleteCategory(id: string): Promise<Category> {
    return this.db.category.delete({
      where: {
        id,
      },
    });
  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const categoryService = new CategoryService();