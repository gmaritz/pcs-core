"use strict";
// ==========================================================
// Customer Routes
// ==========================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRoutes = exports.customerRoutes = void 0;
var customer_routes_1 = require("./customer.routes");
Object.defineProperty(exports, "customerRoutes", { enumerable: true, get: function () { return __importDefault(customer_routes_1).default; } });
var address_routes_1 = require("./address.routes");
Object.defineProperty(exports, "addressRoutes", { enumerable: true, get: function () { return __importDefault(address_routes_1).default; } });
