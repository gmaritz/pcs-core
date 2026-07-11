// ==========================================================
// Media Validation
// ==========================================================

import {
  CreateMediaDto,
  UpdateMediaDto,
} from '../types/media.dto';

export function validateCreateMedia(
  dto: CreateMediaDto,
): void {

  if (!dto.filename?.trim()) {
    throw new Error('Media filename is required.');
  }

  if (!dto.mimeType?.trim()) {
    throw new Error('Media mimeType is required.');
  }

  if (!dto.extension?.trim()) {
    throw new Error('Media extension is required.');
  }

  if (!dto.url?.trim()) {
    throw new Error('Media url is required.');
  }

}

export function validateUpdateMedia(
  dto: UpdateMediaDto,
): void {

  if (
    dto.filename !== undefined &&
    !dto.filename.trim()
  ) {
    throw new Error(
      'Media filename cannot be empty.',
    );
  }

  if (
    dto.url !== undefined &&
    !dto.url.trim()
  ) {
    throw new Error(
      'Media url cannot be empty.',
    );
  }

}
