"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productMediaService = exports.ProductMediaService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Product Media Service
// ==========================================================
class ProductMediaService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve product media records.
     */
    async getProductMedia(options) {
        return this.db.productMedia.findMany(options);
    }
    /**
     * Retrieve a single product media record by its unique identifier.
     */
    async getProductMediaItem(id) {
        return this.db.productMedia.findUnique({
            where: { id },
        });
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new product media record.
     */
    async createProductMedia(dto) {
        const data = {
            mediaRole: dto.mediaRole ?? 'GALLERY',
            displayOrder: dto.displayOrder ?? 0,
            isPrimary: dto.isPrimary ?? false,
            product: {
                connect: {
                    id: dto.productId,
                },
            },
            media: {
                connect: {
                    id: dto.mediaId,
                },
            },
        };
        return this.db.productMedia.create({
            data,
        });
    }
    /**
     * Update an existing product media record.
     */
    async updateProductMedia(id, dto) {
        const data = {};
        if (dto.mediaRole !== undefined) {
            data.mediaRole = dto.mediaRole;
        }
        if (dto.displayOrder !== undefined) {
            data.displayOrder = dto.displayOrder;
        }
        if (dto.isPrimary !== undefined) {
            data.isPrimary = dto.isPrimary;
        }
        return this.db.productMedia.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a product media record.
     */
    async deleteProductMedia(id) {
        return this.db.productMedia.delete({
            where: { id },
        });
    }
}
exports.ProductMediaService = ProductMediaService;
// ==========================================================
// Service Instance
// ==========================================================
exports.productMediaService = new ProductMediaService();
