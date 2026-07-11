"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MediaController_1 = require("../controllers/MediaController");
// ==========================================================
// Router
// ==========================================================
const router = (0, express_1.Router)();
// ==========================================================
// Routes
// ==========================================================
router.get('/', async (req, res, next) => {
    try {
        await MediaController_1.mediaController.getMedia(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await MediaController_1.mediaController.getMediaItem(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        await MediaController_1.mediaController.createMedia(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await MediaController_1.mediaController.updateMedia(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await MediaController_1.mediaController.deleteMedia(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ==========================================================
// Exports
// ==========================================================
exports.default = router;
