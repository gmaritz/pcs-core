// ==========================================================
// Media DTOs
// ==========================================================

/**
 * Request payload for creating a media record.
 */
export interface CreateMediaDto {

  filename: string;

  originalFilename?: string;

  mimeType: string;

  extension: string;

  url: string;

  altText?: string;

  title?: string;

  description?: string;

  width?: number;

  height?: number;

  fileSize?: number;

  displayOrder?: number;

}

/**
 * Request payload for updating a media record.
 */
export interface UpdateMediaDto {

  filename?: string;

  originalFilename?: string;

  mimeType?: string;

  extension?: string;

  url?: string;

  altText?: string;

  title?: string;

  description?: string;

  width?: number;

  height?: number;

  fileSize?: number;

  displayOrder?: number;

}
