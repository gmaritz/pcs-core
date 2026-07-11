"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoMetadataController = exports.SeoMetadataController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const seo_metadata_validation_1 = require("../validation/seo-metadata.validation");
// ==========================================================
// SEO Metadata Controller
// ==========================================================
class SeoMetadataController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all SEO metadata records.
     */
    async getSeoMetadata(_req, res) {
        const seoMetadata = await services_1.seoMetadataService.getSeoMetadata();
        responses_1.ApiResponse.success(res, seoMetadata);
    }
    /**
     * Retrieve a single SEO metadata record.
     */
    async getSeoMetadataItem(req, res) {
        const seoMetadata = await services_1.seoMetadataService.getSeoMetadataItem(req.params.id);
        if (!seoMetadata) {
            responses_1.ApiResponse.notFound(res, 'SEO Metadata not found.');
            return;
        }
        responses_1.ApiResponse.success(res, seoMetadata);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createSeoMetadata(req, res) {
        (0, seo_metadata_validation_1.validateCreateSeoMetadata)(req.body);
        const seoMetadata = await services_1.seoMetadataService.createSeoMetadata(req.body);
        responses_1.ApiResponse.created(res, seoMetadata);
    }
    async updateSeoMetadata(req, res) {
        (0, seo_metadata_validation_1.validateUpdateSeoMetadata)(req.body);
        const seoMetadata = await services_1.seoMetadataService.updateSeoMetadata(req.params.id, req.body);
        responses_1.ApiResponse.success(res, seoMetadata);
    }
    async deleteSeoMetadata(req, res) {
        await services_1.seoMetadataService.deleteSeoMetadata(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.SeoMetadataController = SeoMetadataController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.seoMetadataController = new SeoMetadataController();
