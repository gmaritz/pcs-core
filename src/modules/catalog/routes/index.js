"use strict";
// ==========================================================
// Catalog Routes
// ==========================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariantRoutes = exports.productRoutes = exports.categoryRoutes = exports.sportRoutes = exports.brandRoutes = void 0;
var brand_routes_1 = require("./brand.routes");
Object.defineProperty(exports, "brandRoutes", { enumerable: true, get: function () { return __importDefault(brand_routes_1).default; } });
var sport_routes_1 = require("./sport.routes");
Object.defineProperty(exports, "sportRoutes", { enumerable: true, get: function () { return __importDefault(sport_routes_1).default; } });
var category_routes_1 = require("./category.routes");
Object.defineProperty(exports, "categoryRoutes", { enumerable: true, get: function () { return __importDefault(category_routes_1).default; } });
var product_routes_1 = require("./product.routes");
Object.defineProperty(exports, "productRoutes", { enumerable: true, get: function () { return __importDefault(product_routes_1).default; } });
var product_variant_routes_1 = require("./product-variant.routes");
Object.defineProperty(exports, "productVariantRoutes", { enumerable: true, get: function () { return __importDefault(product_variant_routes_1).default; } });
