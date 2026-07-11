// ==========================================================
// Product Media DTOs
// ==========================================================

import { MediaRole } from '@prisma/client';

/**
 * Request payload for creating a product media record.
 */
export interface CreateProductMediaDto {

  productId: string;

  mediaId: string;

  mediaRole?: MediaRole;

  displayOrder?: number;

  isPrimary?: boolean;

}

/**
 * Request payload for updating a product media record.
 */
export interface UpdateProductMediaDto {

  mediaRole?: MediaRole;

  displayOrder?: number;

  isPrimary?: boolean;

}
