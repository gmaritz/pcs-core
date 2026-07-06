"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierProductController = exports.SupplierProductController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const supplier_product_validation_1 = require("../validation/supplier-product.validation");
// ==========================================================
// Supplier Product Controller
// ==========================================================
class SupplierProductController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all supplier products.
     */
    async getSupplierProducts(_req, res) {
        const supplierProducts = await services_1.supplierProductService.getSupplierProducts();
        responses_1.ApiResponse.success(res, supplierProducts);
    }
    /**
     * Retrieve a single supplier product.
     */
    async getSupplierProduct(req, res) {
        const supplierProduct = await services_1.supplierProductService.getSupplierProduct(req.params.id);
        if (!supplierProduct) {
            responses_1.ApiResponse.notFound(res, 'Supplier Product not found.');
            return;
        }
        responses_1.ApiResponse.success(res, supplierProduct);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createSupplierProduct(req, res) {
        (0, supplier_product_validation_1.validateCreateSupplierProduct)(req.body);
        const supplierProduct = await services_1.supplierProductService.createSupplierProduct(req.body);
        responses_1.ApiResponse.created(res, supplierProduct);
    }
    async updateSupplierProduct(req, res) {
        (0, supplier_product_validation_1.validateUpdateSupplierProduct)(req.body);
        const supplierProduct = await services_1.supplierProductService.updateSupplierProduct(req.params.id, req.body);
        responses_1.ApiResponse.success(res, supplierProduct);
    }
    async deleteSupplierProduct(req, res) {
        await services_1.supplierProductService.deleteSupplierProduct(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.SupplierProductController = SupplierProductController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.supplierProductController = new SupplierProductController();
