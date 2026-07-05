// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../types/category.dto';

import { categoryService } from '../services';

import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../validation/category.validation';

// ==========================================================
// Category Controller
// ==========================================================

export class CategoryController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all categories.
   */
  async getCategories(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const categories =
      await categoryService.getCategories();

    ApiResponse.success(
      res,
      categories,
    );

  }

  /**
   * Retrieve a single category.
   */
  async getCategory(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const category =
      await categoryService.getCategory(
        req.params.id,
      );

    if (!category) {

      ApiResponse.notFound(
        res,
        'Category not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      category,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createCategory(
    req: Request<
      unknown,
      unknown,
      CreateCategoryDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateCategory(
      req.body,
    );

    const category =
      await categoryService.createCategory(
        req.body,
      );

    ApiResponse.created(
      res,
      category,
    );

  }

  async updateCategory(
    req: Request<
      IdParams,
      unknown,
      UpdateCategoryDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateCategory(
      req.body,
    );

    const category =
      await categoryService.updateCategory(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      category,
    );

  }

  async deleteCategory(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await categoryService.deleteCategory(
      req.params.id,
    );

    ApiResponse.noContent(
      res,
    );

  }

}

// ==========================================================
// Controller Instance
// ==========================================================

export const categoryController =
  new CategoryController();