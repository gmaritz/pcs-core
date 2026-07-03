// ==========================================================
// Brand DTOs
// ==========================================================

/**
 * Request payload for creating a brand.
 */
export interface CreateBrandDto {

  name: string;

  description?: string;

  website?: string;

  logoUrl?: string;

  displayOrder?: number;

  sportId: string;

}

/**
 * Request payload for updating a brand.
 */
export interface UpdateBrandDto {

  name?: string;

  description?: string;

  website?: string;

  logoUrl?: string;

  displayOrder?: number;

  sportId?: string;

}