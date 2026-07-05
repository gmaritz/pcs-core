// ==========================================================
// Category Code Service
// ==========================================================

export class CategoryCodeService {

  /**
   * Generate a base category code.
   *
   * Examples:
   * Shoes    -> SHO
   * Rackets  -> RAC
   * Apparel  -> APP
   */
  generate(name: string): string {

    return name
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .substring(0, 3);

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const categoryCodeService =
  new CategoryCodeService();