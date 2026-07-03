import express, { type Express } from 'express';

import { brandRoutes } from './modules/catalog/routes';

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
// API
// ==========================================================

app.use('/api/v1/brands', brandRoutes);

export default app;