"use strict";
// ==========================================================
// Content Routes
// ==========================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productMediaRoutes = exports.mediaRoutes = void 0;
var media_routes_1 = require("./media.routes");
Object.defineProperty(exports, "mediaRoutes", { enumerable: true, get: function () { return __importDefault(media_routes_1).default; } });
var product_media_routes_1 = require("./product-media.routes");
Object.defineProperty(exports, "productMediaRoutes", { enumerable: true, get: function () { return __importDefault(product_media_routes_1).default; } });
