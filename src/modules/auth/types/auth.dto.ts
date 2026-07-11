// ==========================================================
// Auth DTOs
// ==========================================================

import { User } from '@prisma/client';

export interface LoginDto {

  email: string;

  password: string;

}

export interface AuthenticatedRequestUser {

  id: string;

  firstName: string;

  lastName: string;

  email: string;

  status: User['status'];

}

export interface LoginResponseDto {

  token: string;

  user: AuthenticatedRequestUser;

}
