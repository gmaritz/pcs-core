"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseService = exports.WarehouseService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
const services_1 = require("../../shared/services");
// ==========================================================
// Warehouse Service
// ==========================================================
class WarehouseService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single warehouse by its unique identifier.
     */
    async getWarehouse(id) {
        return this.db.warehouse.findUnique({
            where: { id },
        });
    }
    /**
   * Retrieve warehouses.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getWarehouses(options) {
        return this.db.warehouse.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new warehouse.
     */
    async createWarehouse(dto) {
        const slug = services_1.slugService.generate(dto.name);
        // TODO:
        // Replace with unique warehouse code generation once
        // Warehouse numbering strategy is implemented.
        const code = dto.name
            .substring(0, 3)
            .toUpperCase();
        const data = {
            name: dto.name,
            code,
            slug,
            description: dto.description,
            addressLine1: dto.addressLine1,
            addressLine2: dto.addressLine2,
            suburb: dto.suburb,
            city: dto.city,
            province: dto.province,
            postalCode: dto.postalCode,
            country: dto.country,
            contactName: dto.contactName,
            contactEmail: dto.contactEmail,
            contactPhone: dto.contactPhone,
            displayOrder: dto.displayOrder ?? 0,
        };
        return this.db.warehouse.create({
            data,
        });
    }
    /**
     * Update an existing warehouse.
     */
    async updateWarehouse(id, dto) {
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name;
            data.slug = services_1.slugService.generate(dto.name);
            // NOTE:
            // Warehouse codes remain unchanged once created.
        }
        if (dto.description !== undefined) {
            data.description = dto.description;
        }
        if (dto.addressLine1 !== undefined) {
            data.addressLine1 = dto.addressLine1;
        }
        if (dto.addressLine2 !== undefined) {
            data.addressLine2 = dto.addressLine2;
        }
        if (dto.suburb !== undefined) {
            data.suburb = dto.suburb;
        }
        if (dto.city !== undefined) {
            data.city = dto.city;
        }
        if (dto.province !== undefined) {
            data.province = dto.province;
        }
        if (dto.postalCode !== undefined) {
            data.postalCode = dto.postalCode;
        }
        if (dto.country !== undefined) {
            data.country = dto.country;
        }
        if (dto.contactName !== undefined) {
            data.contactName = dto.contactName;
        }
        if (dto.contactEmail !== undefined) {
            data.contactEmail = dto.contactEmail;
        }
        if (dto.contactPhone !== undefined) {
            data.contactPhone = dto.contactPhone;
        }
        if (dto.displayOrder !== undefined) {
            data.displayOrder = dto.displayOrder;
        }
        return this.db.warehouse.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a warehouse.
     */
    async deleteWarehouse(id) {
        return this.db.warehouse.delete({
            where: { id },
        });
    }
}
exports.WarehouseService = WarehouseService;
// ==========================================================
// Service Instance
// ==========================================================
exports.warehouseService = new WarehouseService();
