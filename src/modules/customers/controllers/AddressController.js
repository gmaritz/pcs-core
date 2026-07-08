"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressController = exports.AddressController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const address_validation_1 = require("../validation/address.validation");
// ==========================================================
// Address Controller
// ==========================================================
class AddressController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all addresses.
     */
    async getAddresses(_req, res) {
        const addresses = await services_1.addressService.getAddresses();
        responses_1.ApiResponse.success(res, addresses);
    }
    /**
     * Retrieve a single address.
     */
    async getAddress(req, res) {
        const address = await services_1.addressService.getAddress(req.params.id);
        if (!address) {
            responses_1.ApiResponse.notFound(res, 'Address not found.');
            return;
        }
        responses_1.ApiResponse.success(res, address);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createAddress(req, res) {
        (0, address_validation_1.validateCreateAddress)(req.body);
        const address = await services_1.addressService.createAddress(req.body);
        responses_1.ApiResponse.created(res, address);
    }
    async updateAddress(req, res) {
        (0, address_validation_1.validateUpdateAddress)(req.body);
        const address = await services_1.addressService.updateAddress(req.params.id, req.body);
        responses_1.ApiResponse.success(res, address);
    }
    async deleteAddress(req, res) {
        await services_1.addressService.deleteAddress(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.AddressController = AddressController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.addressController = new AddressController();
