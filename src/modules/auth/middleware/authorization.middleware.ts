// ==========================================================
// Imports
// ==========================================================

import {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  authorizationService,
} from '../services/AuthorizationService';
import {
  PermissionCode,
} from '../types/permissions';
import {
  AuthenticatedRequestUser,
} from '../types/auth.dto';

// ==========================================================
// Authorization Middleware
// ==========================================================

export function authorize(
  permission: PermissionCode,
) {

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {

    const requestWithUser =
      req as Request & {
        user?: AuthenticatedRequestUser;
      };

    if (!requestWithUser.user) {

      res.status(401).json({
        message: 'Unauthorized.',
      });

      return;

    }

    const hasPermission =
      await authorizationService.hasPermission(
        requestWithUser.user.id,
        permission,
      );

    if (!hasPermission) {

      res.status(403).json({
        message: 'Forbidden.',
      });

      return;

    }

    next();

  };

}
