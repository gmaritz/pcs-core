"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productMediaController = exports.ProductMediaController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const product_media_validation_1 = require("../validation/product-media.validation");
// ==========================================================
// Product Media Controller
// ==========================================================
class ProductMediaController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all product media records.
     */
    async getProductMedia(_req, res) {
        const productMedia = await services_1.productMediaService.getProductMedia();
        responses_1.ApiResponse.success(res, productMedia);
    }
    /**
     * Retrieve a single product media record.
     */
    async getProductMediaItem(req, res) {
        const productMedia = await services_1.productMediaService.getProductMediaItem(req.params.id);
        if (!productMedia) {
            responses_1.ApiResponse.notFound(res, 'Product Media not found.');
            return;
        }
        responses_1.ApiResponse.success(res, productMedia);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createProductMedia(req, res) {
        (0, product_media_validation_1.validateCreateProductMedia)(req.body);
        const productMedia = await services_1.productMediaService.createProductMedia(req.body);
        responses_1.ApiResponse.created(res, productMedia);
    }
    async updateProductMedia(req, res) {
        (0, product_media_validation_1.validateUpdateProductMedia)(req.body);
        const productMedia = await services_1.productMediaService.updateProductMedia(req.params.id, req.body);
        responses_1.ApiResponse.success(res, productMedia);
    }
    async deleteProductMedia(req, res) {
        await services_1.productMediaService.deleteProductMedia(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.ProductMediaController = ProductMediaController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.productMediaController = new ProductMediaController();
