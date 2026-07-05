// ==========================================================
// Imports
// ==========================================================

import { Category, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  categoryCodeService,
  slugService,
} from '../../shared/services';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../types/category.dto';

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
  async getCategory(
    id: string,
  ): Promise<Category | null> {

    return this.db.category.findUnique({

      where: { id },

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
    dto: CreateCategoryDto,
  ): Promise<Category> {

    const slug = slugService.generate(
      dto.name,
    );

    const code = categoryCodeService.generate(
      dto.name,
    );

    const data: Prisma.CategoryCreateInput = {

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

    };

    return this.db.category.create({
      data,
    });

  }

  /**
   * Update an existing category.
   */
  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> {

    const data: Prisma.CategoryUpdateInput = {};

    if (dto.name !== undefined) {

      data.name = dto.name;

      data.slug = slugService.generate(
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

    return this.db.category.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a category.
   */
  async deleteCategory(id: string): Promise<Category> {
    return this.db.category.delete({

      where: { id },

    });
  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const categoryService = new CategoryService();