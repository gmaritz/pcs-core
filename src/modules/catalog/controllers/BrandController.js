"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandController = exports.BrandController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const brand_validation_1 = require("../validation/brand.validation");
// ==========================================================
// Brand Controller
// ==========================================================
class BrandController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all brands.
     */
    async getBrands(_req, res) {
        const brands = await services_1.brandService.getBrands();
        responses_1.ApiResponse.success(res, brands);
    }
    /**
     * Retrieve a single brand.
     */
    async getBrand(req, res) {
        const brand = await services_1.brandService.getBrand(req.params.id);
        if (!brand) {
            responses_1.ApiResponse.notFound(res, 'Brand not found.');
            return;
        }
        responses_1.ApiResponse.success(res, brand);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new brand.
     */
    async createBrand(req, res) {
        (0, brand_validation_1.validateCreateBrand)(req.body);
        const brand = await services_1.brandService.createBrand(req.body);
        responses_1.ApiResponse.created(res, brand);
    }
    /**
     * Update an existing brand.
     */
    async updateBrand(req, res) {
        (0, brand_validation_1.validateUpdateBrand)(req.body);
        const brand = await services_1.brandService.updateBrand(req.params.id, req.body);
        responses_1.ApiResponse.success(res, brand);
    }
    /**
     * Delete a brand.
     */
    async deleteBrand(req, res) {
        await services_1.brandService.deleteBrand(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.BrandController = BrandController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.brandController = new BrandController();
