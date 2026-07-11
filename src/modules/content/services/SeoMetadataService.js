"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoMetadataService = exports.SeoMetadataService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// SEO Metadata Service
// ==========================================================
class SeoMetadataService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve SEO metadata records.
     */
    async getSeoMetadata(options) {
        return this.db.seoMetadata.findMany(options);
    }
    /**
     * Retrieve a single SEO metadata record by its unique identifier.
     */
    async getSeoMetadataItem(id) {
        return this.db.seoMetadata.findUnique({
            where: { id },
        });
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new SEO metadata record.
     */
    async createSeoMetadata(dto) {
        const data = {
            metaTitle: dto.metaTitle,
            metaDescription: dto.metaDescription,
            metaKeywords: dto.metaKeywords,
            canonicalUrl: dto.canonicalUrl,
            ogTitle: dto.ogTitle,
            ogDescription: dto.ogDescription,
            ogImageUrl: dto.ogImageUrl,
            product: {
                connect: {
                    id: dto.productId,
                },
            },
        };
        return this.db.seoMetadata.create({
            data,
        });
    }
    /**
     * Update an existing SEO metadata record.
     */
    async updateSeoMetadata(id, dto) {
        const data = {};
        if (dto.productId !== undefined) {
            data.product = {
                connect: {
                    id: dto.productId,
                },
            };
        }
        if (dto.metaTitle !== undefined) {
            data.metaTitle = dto.metaTitle;
        }
        if (dto.metaDescription !== undefined) {
            data.metaDescription = dto.metaDescription;
        }
        if (dto.metaKeywords !== undefined) {
            data.metaKeywords = dto.metaKeywords;
        }
        if (dto.canonicalUrl !== undefined) {
            data.canonicalUrl = dto.canonicalUrl;
        }
        if (dto.ogTitle !== undefined) {
            data.ogTitle = dto.ogTitle;
        }
        if (dto.ogDescription !== undefined) {
            data.ogDescription = dto.ogDescription;
        }
        if (dto.ogImageUrl !== undefined) {
            data.ogImageUrl = dto.ogImageUrl;
        }
        return this.db.seoMetadata.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a SEO metadata record.
     */
    async deleteSeoMetadata(id) {
        return this.db.seoMetadata.delete({
            where: { id },
        });
    }
}
exports.SeoMetadataService = SeoMetadataService;
// ==========================================================
// Service Instance
// ==========================================================
exports.seoMetadataService = new SeoMetadataService();
