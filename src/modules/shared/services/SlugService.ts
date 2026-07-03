// ==========================================================
// Slug Service
// ==========================================================

export class SlugService {

  /**
   * Generate a URL-friendly slug.
   */
  generate(value: string): string {

    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const slugService = new SlugService();