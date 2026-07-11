"use strict";
// ==========================================================
// Imports
// ==========================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Auth Service
// ==========================================================
class AuthService extends BaseService_1.BaseService {
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Authenticate user credentials and return JWT.
     */
    async login(dto) {
        const user = await this.db.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            return null;
        }
        if (user.status !== client_1.RecordStatus.ACTIVE) {
            return null;
        }
        const isPasswordMatch = await bcrypt_1.default.compare(dto.password, user.passwordHash);
        if (!isPasswordMatch) {
            return null;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT secret is not configured.');
        }
        const expiresIn = (process.env.JWT_EXPIRES_IN ?? '24h');
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
        }, secret, {
            expiresIn,
        });
        return {
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                status: user.status,
            },
        };
    }
    /**
     * Return currently authenticated user details.
     */
    async getCurrentUser(userId) {
        const user = await this.db.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
        };
    }
}
exports.AuthService = AuthService;
// ==========================================================
// Service Instance
// ==========================================================
exports.authService = new AuthService();
