"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = exports.CustomerController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const customer_validation_1 = require("../validation/customer.validation");
// ==========================================================
// Customer Controller
// ==========================================================
class CustomerController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all customers.
     */
    async getCustomers(_req, res) {
        const customers = await services_1.customerService.getCustomers();
        responses_1.ApiResponse.success(res, customers);
    }
    /**
     * Retrieve a single customer.
     */
    async getCustomer(req, res) {
        const customer = await services_1.customerService.getCustomer(req.params.id);
        if (!customer) {
            responses_1.ApiResponse.notFound(res, 'Customer not found.');
            return;
        }
        responses_1.ApiResponse.success(res, customer);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createCustomer(req, res) {
        (0, customer_validation_1.validateCreateCustomer)(req.body);
        const customer = await services_1.customerService.createCustomer(req.body);
        responses_1.ApiResponse.created(res, customer);
    }
    async updateCustomer(req, res) {
        (0, customer_validation_1.validateUpdateCustomer)(req.body);
        const customer = await services_1.customerService.updateCustomer(req.params.id, req.body);
        responses_1.ApiResponse.success(res, customer);
    }
    async deleteCustomer(req, res) {
        await services_1.customerService.deleteCustomer(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.CustomerController = CustomerController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.customerController = new CustomerController();
