"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./modules/catalog/routes");
const routes_2 = require("./modules/inventory/routes");
const routes_3 = require("./modules/suppliers/routes");
const error_handler_1 = require("./middleware/error-handler");
const app = (0, express_1.default)();
// ==========================================================
// Global Middleware
// ==========================================================
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ==========================================================
// Health Check
// ==========================================================
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        application: 'PCS Core',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
// ==========================================================
// API v1
// ==========================================================
app.use('/api/v1/brands', routes_1.brandRoutes);
app.use('/api/v1/categories', routes_1.categoryRoutes);
app.use('/api/v1/products', routes_1.productRoutes);
app.use('/api/v1/product-variants', routes_1.productVariantRoutes);
app.use('/api/v1/inventory', routes_2.inventoryRoutes);
app.use('/api/v1/inventory-movements', routes_2.inventoryMovementRoutes);
app.use('/api/v1/suppliers', routes_3.supplierRoutes);
app.use('/api/v1/sports', routes_1.sportRoutes);
// ==========================================================
// Error Handler
// ==========================================================
app.use(error_handler_1.errorHandler);
exports.default = app;
