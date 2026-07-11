"use strict";
// ==========================================================
// Imports
// ==========================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const database_1 = require("../../../infrastructure/database");
// ==========================================================
// JWT Authentication Middleware
// ==========================================================
async function authenticate(req, res, next) {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader ||
        !authorizationHeader.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Unauthorized.',
        });
        return;
    }
    const token = authorizationHeader
        .replace('Bearer ', '')
        .trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not configured.');
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        res.status(401).json({
            message: 'Unauthorized.',
        });
        return;
    }
    const user = await database_1.prisma.user.findUnique({
        where: {
            id: payload.userId,
        },
    });
    if (!user || user.status !== client_1.RecordStatus.ACTIVE) {
        res.status(401).json({
            message: 'Unauthorized.',
        });
        return;
    }
    const requestWithUser = req;
    requestWithUser.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
    };
    next();
}
