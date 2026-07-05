// ==========================================================
// Sport Validation
// ==========================================================

import {
  CreateSportDto,
  UpdateSportDto,
} from '../types/sport.dto';

export function validateCreateSport(
  dto: CreateSportDto,
): void {

  if (!dto.name?.trim()) {
    throw new Error('Sport name is required.');
  }

}

export function validateUpdateSport(
  dto: UpdateSportDto,
): void {

  if (
    dto.name !== undefined &&
    !dto.name.trim()
  ) {
    throw new Error(
      'Sport name cannot be empty.',
    );
  }

}