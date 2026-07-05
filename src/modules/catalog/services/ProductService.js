"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
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
    async getProducts(options) {
        return this.db.product.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new product.
     */
    async createProduct(data) {
        return this.db.product.create({
            data,
        });
    }
    /**
     * Update an existing product.
     */
    async updateProduct(id, data) {
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
    async deleteProduct(id) {
        return this.db.product.delete({
            where: {
                id,
            },
        });
    }
}
exports.ProductService = ProductService;
// ==========================================================
// Service Instance
// ==========================================================
exports.productService = new ProductService();
