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
  addressRoutes,
  customerRoutes,
} from './modules/customers/routes';
import {
  supplierProductRoutes,
  supplierRoutes,
} from './modules/suppliers/routes';

import { errorHandler } from './middleware/error-handler';

const app: Express = express();

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

app.use('/api/v1/brands', brandRoutes);

app.use('/api/v1/categories', categoryRoutes);

app.use('/api/v1/products', productRoutes);

app.use('/api/v1/product-variants', productVariantRoutes);

app.use('/api/v1/inventory', inventoryRoutes);

app.use('/api/v1/inventory-movements', inventoryMovementRoutes);

app.use('/api/v1/warehouses', warehouseRoutes);

app.use('/api/v1/carts', cartRoutes);

app.use('/api/v1/cart-items', cartItemRoutes);

app.use('/api/v1/customers', customerRoutes);

app.use('/api/v1/addresses', addressRoutes);

app.use('/api/v1/suppliers', supplierRoutes);

app.use('/api/v1/supplier-products', supplierProductRoutes);

app.use('/api/v1/sports', sportRoutes);

// ==========================================================
// Error Handler
// ==========================================================

app.use(errorHandler);

export default app;