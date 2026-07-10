"use strict";
// ==========================================================
// Order Routes
// ==========================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemRoutes = exports.orderRoutes = void 0;
var order_routes_1 = require("./order.routes");
Object.defineProperty(exports, "orderRoutes", { enumerable: true, get: function () { return __importDefault(order_routes_1).default; } });
var order_item_routes_1 = require("./order-item.routes");
Object.defineProperty(exports, "orderItemRoutes", { enumerable: true, get: function () { return __importDefault(order_item_routes_1).default; } });
