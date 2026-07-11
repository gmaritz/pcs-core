// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { ApiResponse } from '../../shared/responses';

import {
  AuthenticatedRequestUser,
  LoginDto,
} from '../types/auth.dto';
import { authService } from '../services/AuthService';
import { validateLogin } from '../validation/auth.validation';

// ==========================================================
// Auth Controller
// ==========================================================

export class AuthController {

  // ========================================================
  // Commands
  // ========================================================

  async login(
    req: Request<
      unknown,
      unknown,
      LoginDto
    >,
    res: Response,
  ): Promise<void> {

    validateLogin(req.body);

    const response =
      await authService.login(req.body);

    if (!response) {

      res.status(401).json({
        message: 'Invalid credentials.',
      });

      return;

    }

    ApiResponse.success(res, response);

  }

  // ========================================================
  // Queries
  // ========================================================

  async me(
    req: Request,
    res: Response,
  ): Promise<void> {

    const requestWithUser =
      req as Request & {
        user?: AuthenticatedRequestUser;
      };

    const requestUser =
      requestWithUser.user;

    if (!requestUser) {

      res.status(401).json({
        message: 'Unauthorized.',
      });

      return;

    }

    const user =
      await authService.getCurrentUser(
        requestUser.id,
      );

    if (!user) {

      res.status(401).json({
        message: 'Unauthorized.',
      });

      return;

    }

    ApiResponse.success(res, user);

  }

}

// ==========================================================
// Controller Instance
// ==========================================================

export const authController =
  new AuthController();
