import express, { type Express } from 'express';

import {
  brandRoutes,
  categoryRoutes,
  productRoutes,
  productVariantRoutes,
  sportRoutes,
} from './modules/catalog/routes';
import {
  inventoryMovementRoutes,
  inventoryRoutes,
  warehouseRoutes,
} from './modules/inventory/routes';
import {
  cartItemRoutes,
  cartRoutes,
} from './modules/commerce/routes';
import {
  orderItemRoutes,
  orderRoutes,
} from './modules/orders/routes';
import {
  paymentRoutes,
} from './modules/payments/routes';
import {
  addressRoutes,
  customerRoutes,
} from './modules/customers/routes';
import {
  supplierProductRoutes,
  supplierRoutes,
} from './modules/suppliers/routes';
import {
  productMediaRoutes,
  mediaRoutes,
  seoMetadataRoutes,
} from './modules/content/routes';
import {
  checkoutRoutes,
} from './modules/workflows/checkout/routes';
import {
  orderProcessingRoutes,
} from './modules/workflows/order-processing/routes';
import {
  inventorySyncRoutes,
} from './modules/workflows/inventory-sync/routes';
import {
  supplierImportRoutes,
} from './modules/workflows/supplier-feed-import/routes';
import {
  supplierAdapterRoutes,
} from './modules/workflows/supplier-adapters/routes';
import {
  priceSyncRoutes,
} from './modules/workflows/price-sync/routes';
import {
  productSearchRoutes,
} from './modules/workflows/product-search/routes';
import {
  authRoutes,
} from './modules/auth/routes';
import {
  authenticate,
} from './modules/auth/middleware/jwt.middleware';
import {
  authorize,
} from './modules/auth/middleware/authorization.middleware';
import {
  authorizationService,
  Permissions,
} from './modules/auth';

import { errorHandler } from './middleware/error-handler';

const app: Express = express();

void authorizationService.seedAuthorizationData();

function resolveWritePermission(
  path: string,
) {

  const normalizedPath =
    path.toLowerCase();

  if (
    normalizedPath.startsWith('/brands') ||
    normalizedPath.startsWith('/categories') ||
    normalizedPath.startsWith('/products') ||
    normalizedPath.startsWith('/product-variants') ||
    normalizedPath.startsWith('/pricing') ||
    normalizedPath.startsWith('/sports') ||
    normalizedPath.startsWith('/media') ||
    normalizedPath.startsWith('/product-media') ||
    normalizedPath.startsWith('/seo-metadata')
  ) {
    return Permissions.PRODUCTS_WRITE;
  }

  if (
    normalizedPath.startsWith('/inventory') ||
    normalizedPath.startsWith('/inventory-movements') ||
    normalizedPath.startsWith('/warehouses')
  ) {
    return Permissions.INVENTORY_WRITE;
  }

  if (
    normalizedPath.startsWith('/orders') ||
    normalizedPath.startsWith('/order-items') ||
    normalizedPath.startsWith('/checkout') ||
    normalizedPath.startsWith('/order-processing') ||
    normalizedPath.startsWith('/carts') ||
    normalizedPath.startsWith('/cart-items')
  ) {
    return Permissions.ORDERS_WRITE;
  }

  if (
    normalizedPath.startsWith('/customers') ||
    normalizedPath.startsWith('/addresses')
  ) {
    return Permissions.CUSTOMERS_WRITE;
  }

  if (
    normalizedPath.startsWith('/suppliers') ||
    normalizedPath.startsWith('/supplier-products') ||
    normalizedPath.startsWith('/imports')
  ) {
    return Permissions.SUPPLIERS_WRITE;
  }

  if (normalizedPath.startsWith('/payments')) {
    return Permissions.PAYMENTS_WRITE;
  }

  return null;

}

// ==========================================================
// Global Middleware
// ==========================================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

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

app.use('/api/v1/products', productSearchRoutes);

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1', authenticate);

app.use('/api/v1', async (req, res, next) => {

  if (req.method === 'GET') {

    next();

    return;

  }

  const permission = resolveWritePermission(
    req.path,
  );

  if (!permission) {

    res.status(403).json({
      message: 'Forbidden.',
    });

    return;

  }

  await authorize(permission)(req, res, next);

});

app.use('/api/v1/brands', brandRoutes);

app.use('/api/v1/categories', categoryRoutes);

app.use('/api/v1/products', productRoutes);

app.use('/api/v1/product-variants', productVariantRoutes);

app.use('/api/v1/inventory', inventoryRoutes);

app.use('/api/v1/inventory', inventorySyncRoutes);

app.use('/api/v1/inventory-movements', inventoryMovementRoutes);

app.use('/api/v1/warehouses', warehouseRoutes);

app.use('/api/v1/carts', cartRoutes);

app.use('/api/v1/cart-items', cartItemRoutes);

app.use('/api/v1/orders', orderRoutes);

app.use('/api/v1/order-items', orderItemRoutes);

app.use('/api/v1/payments', paymentRoutes);

app.use('/api/v1/customers', customerRoutes);

app.use('/api/v1/addresses', addressRoutes);

app.use('/api/v1/suppliers', supplierRoutes);

app.use('/api/v1/supplier-products', supplierProductRoutes);

app.use('/api/v1/sports', sportRoutes);

app.use('/api/v1/media', mediaRoutes);

app.use('/api/v1/product-media', productMediaRoutes);

app.use('/api/v1/seo-metadata', seoMetadataRoutes);

app.use('/api/v1/checkout', checkoutRoutes);

app.use('/api/v1/order-processing', orderProcessingRoutes);

app.use('/api/v1/pricing', priceSyncRoutes);

app.use('/api/v1/imports', supplierImportRoutes);

app.use('/api/v1/imports', supplierAdapterRoutes);

// ==========================================================
// Error Handler
// ==========================================================

app.use(errorHandler);

export default app;