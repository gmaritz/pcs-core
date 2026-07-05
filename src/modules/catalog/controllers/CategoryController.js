"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = exports.CategoryController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const category_validation_1 = require("../validation/category.validation");
// ==========================================================
// Category Controller
// ==========================================================
class CategoryController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all categories.
     */
    async getCategories(_req, res) {
        const categories = await services_1.categoryService.getCategories();
        responses_1.ApiResponse.success(res, categories);
    }
    /**
     * Retrieve a single category.
     */
    async getCategory(req, res) {
        const category = await services_1.categoryService.getCategory(req.params.id);
        if (!category) {
            responses_1.ApiResponse.notFound(res, 'Category not found.');
            return;
        }
        responses_1.ApiResponse.success(res, category);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createCategory(req, res) {
        (0, category_validation_1.validateCreateCategory)(req.body);
        const category = await services_1.categoryService.createCategory(req.body);
        responses_1.ApiResponse.created(res, category);
    }
    async updateCategory(req, res) {
        (0, category_validation_1.validateUpdateCategory)(req.body);
        const category = await services_1.categoryService.updateCategory(req.params.id, req.body);
        responses_1.ApiResponse.success(res, category);
    }
    async deleteCategory(req, res) {
        await services_1.categoryService.deleteCategory(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.CategoryController = CategoryController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.categoryController = new CategoryController();
