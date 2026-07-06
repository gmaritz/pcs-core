"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierController = exports.SupplierController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const supplier_validation_1 = require("../validation/supplier.validation");
// ==========================================================
// Supplier Controller
// ==========================================================
class SupplierController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all suppliers.
     */
    async getSuppliers(_req, res) {
        const suppliers = await services_1.supplierService.getSuppliers();
        responses_1.ApiResponse.success(res, suppliers);
    }
    /**
     * Retrieve a single supplier.
     */
    async getSupplier(req, res) {
        const supplier = await services_1.supplierService.getSupplier(req.params.id);
        if (!supplier) {
            responses_1.ApiResponse.notFound(res, 'Supplier not found.');
            return;
        }
        responses_1.ApiResponse.success(res, supplier);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createSupplier(req, res) {
        (0, supplier_validation_1.validateCreateSupplier)(req.body);
        const supplier = await services_1.supplierService.createSupplier(req.body);
        responses_1.ApiResponse.created(res, supplier);
    }
    async updateSupplier(req, res) {
        (0, supplier_validation_1.validateUpdateSupplier)(req.body);
        const supplier = await services_1.supplierService.updateSupplier(req.params.id, req.body);
        responses_1.ApiResponse.success(res, supplier);
    }
    async deleteSupplier(req, res) {
        await services_1.supplierService.deleteSupplier(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.SupplierController = SupplierController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.supplierController = new SupplierController();
