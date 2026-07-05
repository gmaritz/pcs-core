"use strict";
// ==========================================================
// PCS Core Environment Configuration
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
exports.environment = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3000),
    appName: 'PCS Core',
    appVersion: '1.0.0',
};
exports.default = exports.environment;
