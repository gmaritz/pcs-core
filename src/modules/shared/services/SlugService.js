"use strict";
// ==========================================================
// Slug Service
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugService = exports.SlugService = void 0;
class SlugService {
    /**
     * Generate a URL-friendly slug.
     */
    generate(value) {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
exports.SlugService = SlugService;
// ==========================================================
// Service Instance
// ==========================================================
exports.slugService = new SlugService();
