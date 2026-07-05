"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariantService = exports.ProductVariantService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
const services_1 = require("../../shared/services");
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
            where: { id },
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
    async createProductVariant(dto) {
        const slug = services_1.slugService.generate(dto.name);
        const sku = dto.name
            .substring(0, 3)
            .toUpperCase();
        const data = {
            name: dto.name,
            sku,
            slug,
            description: dto.description,
            displayOrder: dto.displayOrder ?? 0,
            product: {
                connect: {
                    id: dto.productId,
                },
            },
        };
        return this.db.productVariant.create({
            data,
        });
    }
    /**
     * Update an existing product variant.
     */
    async updateProductVariant(id, dto) {
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name;
            data.slug = services_1.slugService.generate(dto.name);
            // SKU remains unchanged once created.
        }
        if (dto.description !== undefined) {
            data.description = dto.description;
        }
        if (dto.displayOrder !== undefined) {
            data.displayOrder = dto.displayOrder;
        }
        if (dto.productId !== undefined) {
            data.product = {
                connect: {
                    id: dto.productId,
                },
            };
        }
        return this.db.productVariant.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a product variant.
     */
    async deleteProductVariant(id) {
        return this.db.productVariant.delete({
            where: { id },
        });
    }
}
exports.ProductVariantService = ProductVariantService;
// ==========================================================
// Service Instance
// ==========================================================
exports.productVariantService = new ProductVariantService();
