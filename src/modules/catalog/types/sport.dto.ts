// ==========================================================
// Sport DTOs
// ==========================================================

/**
 * Request payload for creating a sport.
 */
export interface CreateSportDto {

  name: string;

  description?: string;

  displayOrder?: number;

}

/**
 * Request payload for updating a sport.
 */
export interface UpdateSportDto {

  name?: string;

  description?: string;

  displayOrder?: number;

}