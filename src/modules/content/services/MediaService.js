"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = exports.MediaService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Media Service
// ==========================================================
class MediaService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve media records.
     */
    async getMedia(options) {
        return this.db.media.findMany(options);
    }
    /**
     * Retrieve a single media record by its unique identifier.
     */
    async getMediaItem(id) {
        return this.db.media.findUnique({
            where: { id },
        });
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new media record.
     */
    async createMedia(dto) {
        const data = {
            filename: dto.filename,
            originalFilename: dto.originalFilename,
            mimeType: dto.mimeType,
            extension: dto.extension,
            url: dto.url,
            altText: dto.altText,
            title: dto.title,
            description: dto.description,
            width: dto.width,
            height: dto.height,
            fileSize: dto.fileSize,
            displayOrder: dto.displayOrder ?? 0,
        };
        return this.db.media.create({
            data,
        });
    }
    /**
     * Update an existing media record.
     */
    async updateMedia(id, dto) {
        const data = {};
        if (dto.filename !== undefined) {
            data.filename = dto.filename;
        }
        if (dto.originalFilename !== undefined) {
            data.originalFilename = dto.originalFilename;
        }
        if (dto.mimeType !== undefined) {
            data.mimeType = dto.mimeType;
        }
        if (dto.extension !== undefined) {
            data.extension = dto.extension;
        }
        if (dto.url !== undefined) {
            data.url = dto.url;
        }
        if (dto.altText !== undefined) {
            data.altText = dto.altText;
        }
        if (dto.title !== undefined) {
            data.title = dto.title;
        }
        if (dto.description !== undefined) {
            data.description = dto.description;
        }
        if (dto.width !== undefined) {
            data.width = dto.width;
        }
        if (dto.height !== undefined) {
            data.height = dto.height;
        }
        if (dto.fileSize !== undefined) {
            data.fileSize = dto.fileSize;
        }
        if (dto.displayOrder !== undefined) {
            data.displayOrder = dto.displayOrder;
        }
        return this.db.media.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a media record.
     */
    async deleteMedia(id) {
        return this.db.media.delete({
            where: { id },
        });
    }
}
exports.MediaService = MediaService;
// ==========================================================
// Service Instance
// ==========================================================
exports.mediaService = new MediaService();
