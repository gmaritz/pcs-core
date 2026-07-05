"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.sportService = exports.SportService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
const services_1 = require("../../shared/services");
// ==========================================================
// Sport Service
// ==========================================================
class SportService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single sport.
     */
    async getSport(id) {
        return this.db.sport.findUnique({
            where: { id },
        });
    }
    /**
     * Retrieve sports.
     */
    async getSports(options) {
        return this.db.sport.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new sport.
     */
    async createSport(dto) {
        const slug = services_1.slugService.generate(dto.name);
        const data = {
            name: dto.name,
            code: dto.name
                .substring(0, 3)
                .toUpperCase(),
            slug,
            description: dto.description,
            displayOrder: dto.displayOrder ?? 0,
        };
        return this.db.sport.create({
            data,
        });
    }
    /**
     * Update an existing sport.
     */
    async updateSport(id, dto) {
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name;
            data.slug = services_1.slugService.generate(dto.name);
        }
        if (dto.description !== undefined) {
            data.description =
                dto.description;
        }
        if (dto.displayOrder !== undefined) {
            data.displayOrder =
                dto.displayOrder;
        }
        return this.db.sport.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a sport.
     */
    async deleteSport(id) {
        return this.db.sport.delete({
            where: { id },
        });
    }
}
exports.SportService = SportService;
// ==========================================================
// Service Instance
// ==========================================================
exports.sportService = new SportService();
