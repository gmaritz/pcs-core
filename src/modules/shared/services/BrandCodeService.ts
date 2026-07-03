// ==========================================================
// Brand Code Service
// ==========================================================

export class BrandCodeService {

  /**
   * Generate a base brand code.
   *
   * Examples:
   * Wilson  -> WIL
   * Yonex   -> YON
   * Head    -> HEA
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

export const brandCodeService = new BrandCodeService();