// ==========================================================
// Imports
// ==========================================================

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RecordStatus } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  AuthenticatedRequestUser,
  LoginDto,
  LoginResponseDto,
} from '../types/auth.dto';

// ==========================================================
// Auth Service
// ==========================================================

export class AuthService extends BaseService {

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Authenticate user credentials and return JWT.
   */
  async login(
    dto: LoginDto,
  ): Promise<LoginResponseDto | null> {

    const user = await this.db.user.findUnique({

      where: {
        email: dto.email,
      },

    });

    if (!user) {
      return null;
    }

    if (user.status !== RecordStatus.ACTIVE) {
      return null;
    }

    const isPasswordMatch =
      await bcrypt.compare(
        dto.password,
        user.passwordHash,
      );

    if (!isPasswordMatch) {
      return null;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT secret is not configured.');
    }

    const expiresIn =
      (process.env.JWT_EXPIRES_IN ?? '24h') as jwt.SignOptions['expiresIn'];

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn,
      },
    );

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
  async getCurrentUser(
    userId: string,
  ): Promise<AuthenticatedRequestUser | null> {

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

// ==========================================================
// Service Instance
// ==========================================================

export const authService =
  new AuthService();
