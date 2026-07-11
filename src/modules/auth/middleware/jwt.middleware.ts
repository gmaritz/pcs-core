// ==========================================================
// Imports
// ==========================================================

import {
  NextFunction,
  Request,
  Response,
} from 'express';
import jwt, {
  JwtPayload,
} from 'jsonwebtoken';
import { RecordStatus } from '@prisma/client';

import { prisma } from '../../../infrastructure/database';
import { AuthenticatedRequestUser } from '../types/auth.dto';

interface AuthTokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

// ==========================================================
// JWT Authentication Middleware
// ==========================================================

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {

  const authorizationHeader =
    req.header('Authorization');

  if (
    !authorizationHeader ||
    !authorizationHeader.startsWith('Bearer ')
  ) {

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

  let payload: AuthTokenPayload;

  try {

    payload = jwt.verify(
      token,
      secret,
    ) as AuthTokenPayload;

  } catch {

    res.status(401).json({
      message: 'Unauthorized.',
    });

    return;

  }

  const user = await prisma.user.findUnique({

    where: {
      id: payload.userId,
    },

  });

  if (!user || user.status !== RecordStatus.ACTIVE) {

    res.status(401).json({
      message: 'Unauthorized.',
    });

    return;

  }

  const requestWithUser =
    req as Request & {
      user?: AuthenticatedRequestUser;
    };

  requestWithUser.user = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    status: user.status,
  };

  next();

}
