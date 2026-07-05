"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
const services_1 = require("../../shared/services");
// ==========================================================
// Category Service
// ==========================================================
class CategoryService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single category by its unique identifier.
     */
    async getCategory(id) {
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
    async getCategories(options) {
        return this.db.category.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new category.
     */
    async createCategory(dto) {
        const slug = services_1.slugService.generate(dto.name);
        const code = services_1.categoryCodeService.generate(dto.name);
        const data = {
            name: dto.name,
            code,
            slug,
            description: dto.description,
            displayOrder: dto.displayOrder ?? 0,
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
    async updateCategory(id, dto) {
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name;
            data.slug = services_1.slugService.generate(dto.name);
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
    async deleteCategory(id) {
        return this.db.category.delete({
            where: { id },
        });
    }
}
exports.CategoryService = CategoryService;
// ==========================================================
// Service Instance
// ==========================================================
exports.categoryService = new CategoryService();
