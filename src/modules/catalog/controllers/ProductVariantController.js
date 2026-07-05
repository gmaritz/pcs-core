"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariantController = exports.ProductVariantController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const product_variant_validation_1 = require("../validation/product-variant.validation");
// ==========================================================
// Product Variant Controller
// ==========================================================
class ProductVariantController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all product variants.
     */
    async getProductVariants(_req, res) {
        const variants = await services_1.productVariantService.getProductVariants();
        responses_1.ApiResponse.success(res, variants);
    }
    /**
     * Retrieve a single product variant.
     */
    async getProductVariant(req, res) {
        const variant = await services_1.productVariantService.getProductVariant(req.params.id);
        if (!variant) {
            responses_1.ApiResponse.notFound(res, 'Product variant not found.');
            return;
        }
        responses_1.ApiResponse.success(res, variant);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createProductVariant(req, res) {
        (0, product_variant_validation_1.validateCreateProductVariant)(req.body);
        const variant = await services_1.productVariantService.createProductVariant(req.body);
        responses_1.ApiResponse.created(res, variant);
    }
    async updateProductVariant(req, res) {
        (0, product_variant_validation_1.validateUpdateProductVariant)(req.body);
        const variant = await services_1.productVariantService.updateProductVariant(req.params.id, req.body);
        responses_1.ApiResponse.success(res, variant);
    }
    async deleteProductVariant(req, res) {
        await services_1.productVariantService.deleteProductVariant(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.ProductVariantController = ProductVariantController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.productVariantController = new ProductVariantController();
