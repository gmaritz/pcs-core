"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.specificationService = exports.SpecificationService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Specification Service
// ==========================================================
class SpecificationService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single specification by its unique identifier.
     */
    async getSpecification(id) {
        return this.db.specification.findUnique({
            where: {
                id,
            },
        });
    }
    /**
   * Retrieve specifications.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getSpecifications(options) {
        return this.db.specification.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new specification.
     */
    async createSpecification(data) {
        return this.db.specification.create({
            data,
        });
    }
    /**
     * Update an existing specification.
     */
    async updateSpecification(id, data) {
        return this.db.specification.update({
            where: {
                id,
            },
            data,
        });
    }
    /**
     * Delete a specification.
     */
    async deleteSpecification(id) {
        return this.db.specification.delete({
            where: {
                id,
            },
        });
    }
}
exports.SpecificationService = SpecificationService;
// ==========================================================
// Service Instance
// ==========================================================
exports.specificationService = new SpecificationService();
