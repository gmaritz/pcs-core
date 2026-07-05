// ==========================================================
// Product Code Service
// ==========================================================

export class ProductCodeService {

  /**
   * Generate a temporary product code.
   *
   * Uses the same temporary strategy as Sport.
   */
  generate(name: string): string {

    return name
      .substring(0, 3)
      .toUpperCase();

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const productCodeService =
  new ProductCodeService();