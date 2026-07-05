"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.sportController = exports.SportController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const sport_validation_1 = require("../validation/sport.validation");
// ==========================================================
// Sport Controller
// ==========================================================
class SportController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all sports.
     */
    async getSports(_req, res) {
        const sports = await services_1.sportService.getSports();
        responses_1.ApiResponse.success(res, sports);
    }
    /**
     * Retrieve a single sport.
     */
    async getSport(req, res) {
        const sport = await services_1.sportService.getSport(req.params.id);
        if (!sport) {
            responses_1.ApiResponse.notFound(res, 'Sport not found.');
            return;
        }
        responses_1.ApiResponse.success(res, sport);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createSport(req, res) {
        console.log('POST Sport Body:', req.body);
        (0, sport_validation_1.validateCreateSport)(req.body);
        const sport = await services_1.sportService.createSport(req.body);
        responses_1.ApiResponse.created(res, sport);
    }
    async updateSport(req, res) {
        (0, sport_validation_1.validateUpdateSport)(req.body);
        const sport = await services_1.sportService.updateSport(req.params.id, req.body);
        responses_1.ApiResponse.success(res, sport);
    }
    async deleteSport(req, res) {
        await services_1.sportService.deleteSport(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.SportController = SportController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.sportController = new SportController();
