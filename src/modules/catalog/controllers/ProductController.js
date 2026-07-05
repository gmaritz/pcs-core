"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.ProductController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const product_validation_1 = require("../validation/product.validation");
// ==========================================================
// Product Controller
// ==========================================================
class ProductController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all products.
     */
    async getProducts(_req, res) {
        const products = await services_1.productService.getProducts();
        responses_1.ApiResponse.success(res, products);
    }
    /**
     * Retrieve a single product.
     */
    async getProduct(req, res) {
        const product = await services_1.productService.getProduct(req.params.id);
        if (!product) {
            responses_1.ApiResponse.notFound(res, 'Product not found.');
            return;
        }
        responses_1.ApiResponse.success(res, product);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createProduct(req, res) {
        (0, product_validation_1.validateCreateProduct)(req.body);
        const product = await services_1.productService.createProduct(req.body);
        responses_1.ApiResponse.created(res, product);
    }
    async updateProduct(req, res) {
        (0, product_validation_1.validateUpdateProduct)(req.body);
        const product = await services_1.productService.updateProduct(req.params.id, req.body);
        responses_1.ApiResponse.success(res, product);
    }
    async deleteProduct(req, res) {
        await services_1.productService.deleteProduct(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.ProductController = ProductController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.productController = new ProductController();
