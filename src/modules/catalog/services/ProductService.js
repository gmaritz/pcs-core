"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
const services_1 = require("../../shared/services");
// ==========================================================
// Product Service
// ==========================================================
class ProductService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single product by its unique identifier.
     */
    async getProduct(id) {
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
    async getProducts(options) {
        return this.db.product.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new product.
     */
    async createProduct(dto) {
        const slug = services_1.slugService.generate(dto.name);
        const code = services_1.productCodeService.generate(dto.name);
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
    async updateProduct(id, dto) {
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name;
            data.slug = services_1.slugService.generate(dto.name);
            data.code = services_1.productCodeService.generate(dto.name);
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
    async deleteProduct(id) {
        return this.db.product.delete({
            where: { id },
        });
    }
}
exports.ProductService = ProductService;
// ==========================================================
// Service Instance
// ==========================================================
exports.productService = new ProductService();
