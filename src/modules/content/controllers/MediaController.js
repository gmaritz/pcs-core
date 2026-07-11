"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaController = exports.MediaController = void 0;
const responses_1 = require("../../shared/responses");
const services_1 = require("../services");
const media_validation_1 = require("../validation/media.validation");
// ==========================================================
// Media Controller
// ==========================================================
class MediaController {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve all media records.
     */
    async getMedia(_req, res) {
        const media = await services_1.mediaService.getMedia();
        responses_1.ApiResponse.success(res, media);
    }
    /**
     * Retrieve a single media record.
     */
    async getMediaItem(req, res) {
        const media = await services_1.mediaService.getMediaItem(req.params.id);
        if (!media) {
            responses_1.ApiResponse.notFound(res, 'Media not found.');
            return;
        }
        responses_1.ApiResponse.success(res, media);
    }
    // ========================================================
    // Commands
    // ========================================================
    async createMedia(req, res) {
        (0, media_validation_1.validateCreateMedia)(req.body);
        const media = await services_1.mediaService.createMedia(req.body);
        responses_1.ApiResponse.created(res, media);
    }
    async updateMedia(req, res) {
        (0, media_validation_1.validateUpdateMedia)(req.body);
        const media = await services_1.mediaService.updateMedia(req.params.id, req.body);
        responses_1.ApiResponse.success(res, media);
    }
    async deleteMedia(req, res) {
        await services_1.mediaService.deleteMedia(req.params.id);
        responses_1.ApiResponse.noContent(res);
    }
}
exports.MediaController = MediaController;
// ==========================================================
// Controller Instance
// ==========================================================
exports.mediaController = new MediaController();
