"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariantService = exports.ProductVariantService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Product Variant Service
// ==========================================================
class ProductVariantService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single product variant by its unique identifier.
     */
    async getProductVariant(id) {
        return this.db.productVariant.findUnique({
            where: {
                id,
            },
        });
    }
    /**
   * Retrieve product variants.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getProductVariants(options) {
        return this.db.productVariant.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new product variant.
     */
    async createProductVariant(data) {
        return this.db.productVariant.create({
            data,
        });
    }
    /**
     * Update an existing product variant.
     */
    async updateProductVariant(id, data) {
        return this.db.productVariant.update({
            where: {
                id,
            },
            data,
        });
    }
    /**
     * Delete a product variant.
     */
    async deleteProductVariant(id) {
        return this.db.productVariant.delete({
            where: {
                id,
            },
        });
    }
}
exports.ProductVariantService = ProductVariantService;
// ==========================================================
// Service Instance
// ==========================================================
exports.productVariantService = new ProductVariantService();
