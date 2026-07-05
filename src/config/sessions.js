"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
exports.sessionConfig = { secret: process.env.SESSION_SECRET ?? 'placeholder' };
