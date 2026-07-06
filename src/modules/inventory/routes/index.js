"use strict";
// ==========================================================
// Inventory Routes
// ==========================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseRoutes = exports.inventoryMovementRoutes = exports.inventoryRoutes = void 0;
var inventory_routes_1 = require("./inventory.routes");
Object.defineProperty(exports, "inventoryRoutes", { enumerable: true, get: function () { return __importDefault(inventory_routes_1).default; } });
var inventory_movement_routes_1 = require("./inventory-movement.routes");
Object.defineProperty(exports, "inventoryMovementRoutes", { enumerable: true, get: function () { return __importDefault(inventory_movement_routes_1).default; } });
var warehouse_routes_1 = require("./warehouse.routes");
Object.defineProperty(exports, "warehouseRoutes", { enumerable: true, get: function () { return __importDefault(warehouse_routes_1).default; } });
