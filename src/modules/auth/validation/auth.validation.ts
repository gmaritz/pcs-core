// ==========================================================
// Auth Validation
// ==========================================================

import { LoginDto } from '../types/auth.dto';

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(
  dto: LoginDto,
): void {

  if (!dto.email?.trim()) {
    throw new Error('Email is required.');
  }

  if (!EMAIL_REGEX.test(dto.email)) {
    throw new Error('Email must be valid.');
  }

  if (!dto.password?.trim()) {
    throw new Error('Password is required.');
  }

}
