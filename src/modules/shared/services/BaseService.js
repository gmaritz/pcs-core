"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const database_1 = require("../../../infrastructure/database");
// ==========================================================
// Base Service
// ==========================================================
class BaseService {
    constructor() {
        this.db = database_1.prisma;
    }
}
exports.BaseService = BaseService;
