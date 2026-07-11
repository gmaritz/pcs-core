// ==========================================================
// SEO Metadata Validation
// ==========================================================

import {
  CreateSeoMetadataDto,
  UpdateSeoMetadataDto,
} from '../types/seo-metadata.dto';

export function validateCreateSeoMetadata(
  dto: CreateSeoMetadataDto,
): void {

  if (!dto.productId?.trim()) {
    throw new Error('Product id is required.');
  }

  if (!dto.metaTitle?.trim()) {
    throw new Error('Meta title is required.');
  }

}

export function validateUpdateSeoMetadata(
  dto: UpdateSeoMetadataDto,
): void {

  if (
    dto.metaTitle !== undefined &&
    !dto.metaTitle.trim()
  ) {
    throw new Error(
      'Meta title cannot be empty.',
    );
  }

}
