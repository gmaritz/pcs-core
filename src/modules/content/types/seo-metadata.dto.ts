// ==========================================================
// SEO Metadata DTOs
// ==========================================================

/**
 * Request payload for creating SEO metadata.
 */
export interface CreateSeoMetadataDto {

  productId: string;

  metaTitle: string;

  metaDescription?: string;

  metaKeywords?: string;

  canonicalUrl?: string;

  ogTitle?: string;

  ogDescription?: string;

  ogImageUrl?: string;

}

/**
 * Request payload for updating SEO metadata.
 */
export interface UpdateSeoMetadataDto {

  productId?: string;

  metaTitle?: string;

  metaDescription?: string;

  metaKeywords?: string;

  canonicalUrl?: string;

  ogTitle?: string;

  ogDescription?: string;

  ogImageUrl?: string;

}
