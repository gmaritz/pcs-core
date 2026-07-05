"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandService = exports.BrandService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
const services_1 = require("../../shared/services");
// ==========================================================
// Brand Service
// ==========================================================
class BrandService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single brand.
     */
    async getBrand(id) {
        return this.db.brand.findUnique({
            where: { id },
        });
    }
    /**
     * Retrieve brands.
     *
     * Supports filtering, pagination,
     * sorting and includes.
     */
    async getBrands(options) {
        return this.db.brand.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new brand.
     */
    async createBrand(dto) {
        const slug = services_1.slugService.generate(dto.name);
        // TODO:
        // Replace with unique code generation once the
        // Brand numbering strategy has been implemented.
        const code = services_1.brandCodeService.generate(dto.name);
        const data = {
            name: dto.name,
            code,
            slug,
            description: dto.description,
            website: dto.website,
            logoUrl: dto.logoUrl,
            displayOrder: dto.displayOrder ?? 0,
            sport: {
                connect: {
                    id: dto.sportId,
                },
            },
        };
        return this.db.brand.create({
            data,
        });
    }
    /**
     * Update an existing brand.
     */
    async updateBrand(id, dto) {
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name;
            data.slug = services_1.slugService.generate(dto.name);
            // NOTE:
            // Brand codes remain unchanged once created.
        }
        if (dto.description !== undefined) {
            data.description = dto.description;
        }
        if (dto.website !== undefined) {
            data.website = dto.website;
        }
        if (dto.logoUrl !== undefined) {
            data.logoUrl = dto.logoUrl;
        }
        if (dto.displayOrder !== undefined) {
            data.displayOrder = dto.displayOrder;
        }
        if (dto.sportId !== undefined) {
            data.sport = {
                connect: {
                    id: dto.sportId,
                },
            };
        }
        return this.db.brand.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a brand.
     */
    async deleteBrand(id) {
        return this.db.brand.delete({
            where: { id },
        });
    }
}
exports.BrandService = BrandService;
// ==========================================================
// Service Instance
// ==========================================================
exports.brandService = new BrandService();
