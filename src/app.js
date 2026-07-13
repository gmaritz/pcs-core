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
const routes_9 = require("./modules/workflows/checkout/routes");
const routes_10 = require("./modules/workflows/order-processing/routes");
const routes_11 = require("./modules/workflows/supplier-feed-import/routes");
const routes_12 = require("./modules/auth/routes");
const jwt_middleware_1 = require("./modules/auth/middleware/jwt.middleware");
const authorization_middleware_1 = require("./modules/auth/middleware/authorization.middleware");
const auth_1 = require("./modules/auth");
const error_handler_1 = require("./middleware/error-handler");
const app = (0, express_1.default)();
void auth_1.authorizationService.seedAuthorizationData();
function resolveWritePermission(path) {
    const normalizedPath = path.toLowerCase();
    if (normalizedPath.startsWith('/brands') ||
        normalizedPath.startsWith('/categories') ||
        normalizedPath.startsWith('/products') ||
        normalizedPath.startsWith('/product-variants') ||
        normalizedPath.startsWith('/sports') ||
        normalizedPath.startsWith('/media') ||
        normalizedPath.startsWith('/product-media') ||
        normalizedPath.startsWith('/seo-metadata')) {
        return auth_1.Permissions.PRODUCTS_WRITE;
    }
    if (normalizedPath.startsWith('/inventory') ||
        normalizedPath.startsWith('/inventory-movements') ||
        normalizedPath.startsWith('/warehouses')) {
        return auth_1.Permissions.INVENTORY_WRITE;
    }
    if (normalizedPath.startsWith('/orders') ||
        normalizedPath.startsWith('/order-items') ||
        normalizedPath.startsWith('/checkout') ||
        normalizedPath.startsWith('/order-processing') ||
        normalizedPath.startsWith('/carts') ||
        normalizedPath.startsWith('/cart-items')) {
        return auth_1.Permissions.ORDERS_WRITE;
    }
    if (normalizedPath.startsWith('/customers') ||
        normalizedPath.startsWith('/addresses')) {
        return auth_1.Permissions.CUSTOMERS_WRITE;
    }
    if (normalizedPath.startsWith('/suppliers') ||
        normalizedPath.startsWith('/supplier-products') ||
        normalizedPath.startsWith('/imports')) {
        return auth_1.Permissions.SUPPLIERS_WRITE;
    }
    if (normalizedPath.startsWith('/payments')) {
        return auth_1.Permissions.PAYMENTS_WRITE;
    }
    return null;
}
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
app.use('/api/v1/auth', routes_12.authRoutes);
app.use('/api/v1', jwt_middleware_1.authenticate);
app.use('/api/v1', async (req, res, next) => {
    if (req.method === 'GET') {
        next();
        return;
    }
    const permission = resolveWritePermission(req.path);
    if (!permission) {
        res.status(403).json({
            message: 'Forbidden.',
        });
        return;
    }
    await (0, authorization_middleware_1.authorize)(permission)(req, res, next);
});
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
app.use('/api/v1/checkout', routes_9.checkoutRoutes);
app.use('/api/v1/order-processing', routes_10.orderProcessingRoutes);
app.use('/api/v1/imports', routes_11.supplierImportRoutes);
// ==========================================================
// Error Handler
// ==========================================================
app.use(error_handler_1.errorHandler);
exports.default = app;
