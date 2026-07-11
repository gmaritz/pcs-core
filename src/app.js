"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./modules/catalog/routes");
const routes_2 = require("./modules/inventory/routes");
const routes_3 = require("./modules/commerce/routes");
const routes_4 = require("./modules/orders/routes");
const routes_5 = require("./modules/payments/routes");
const routes_6 = require("./modules/customers/routes");
const routes_7 = require("./modules/suppliers/routes");
const routes_8 = require("./modules/content/routes");
const routes_9 = require("./modules/auth/routes");
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
app.use('/api/v1/warehouses', routes_2.warehouseRoutes);
app.use('/api/v1/carts', routes_3.cartRoutes);
app.use('/api/v1/cart-items', routes_3.cartItemRoutes);
app.use('/api/v1/orders', routes_4.orderRoutes);
app.use('/api/v1/order-items', routes_4.orderItemRoutes);
app.use('/api/v1/payments', routes_5.paymentRoutes);
app.use('/api/v1/customers', routes_6.customerRoutes);
app.use('/api/v1/addresses', routes_6.addressRoutes);
app.use('/api/v1/suppliers', routes_7.supplierRoutes);
app.use('/api/v1/supplier-products', routes_7.supplierProductRoutes);
app.use('/api/v1/sports', routes_1.sportRoutes);
app.use('/api/v1/media', routes_8.mediaRoutes);
app.use('/api/v1/product-media', routes_8.productMediaRoutes);
app.use('/api/v1/seo-metadata', routes_8.seoMetadataRoutes);
app.use('/api/v1/auth', routes_9.authRoutes);
// ==========================================================
// Error Handler
// ==========================================================
app.use(error_handler_1.errorHandler);
exports.default = app;
