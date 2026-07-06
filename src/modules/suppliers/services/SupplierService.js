"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierService = exports.SupplierService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
const services_1 = require("../../shared/services");
// ==========================================================
// Supplier Service
// ==========================================================
class SupplierService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single supplier by its unique identifier.
     */
    async getSupplier(id) {
        return this.db.supplier.findUnique({
            where: { id },
        });
    }
    /**
   * Retrieve suppliers.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getSuppliers(options) {
        return this.db.supplier.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new supplier.
     */
    async createSupplier(dto) {
        const slug = services_1.slugService.generate(dto.name);
        // TODO:
        // Replace with unique supplier code generation once
        // Supplier numbering strategy is implemented.
        const code = dto.name
            .substring(0, 3)
            .toUpperCase();
        const data = {
            name: dto.name,
            code,
            slug,
            description: dto.description,
            website: dto.website,
            email: dto.email,
            telephone: dto.telephone,
            displayOrder: dto.displayOrder ?? 0,
        };
        return this.db.supplier.create({
            data,
        });
    }
    /**
     * Update an existing supplier.
     */
    async updateSupplier(id, dto) {
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name;
            data.slug = services_1.slugService.generate(dto.name);
            // NOTE:
            // Supplier codes remain unchanged once created.
        }
        if (dto.description !== undefined) {
            data.description = dto.description;
        }
        if (dto.website !== undefined) {
            data.website = dto.website;
        }
        if (dto.email !== undefined) {
            data.email = dto.email;
        }
        if (dto.telephone !== undefined) {
            data.telephone = dto.telephone;
        }
        if (dto.displayOrder !== undefined) {
            data.displayOrder = dto.displayOrder;
        }
        return this.db.supplier.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a supplier.
     */
    async deleteSupplier(id) {
        return this.db.supplier.delete({
            where: { id },
        });
    }
}
exports.SupplierService = SupplierService;
// ==========================================================
// Service Instance
// ==========================================================
exports.supplierService = new SupplierService();
