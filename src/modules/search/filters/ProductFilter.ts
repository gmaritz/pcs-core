// ==========================================================
// Imports
// ==========================================================

import {
  ProductSearchCriteria,
  ProductSearchRecord,
} from '../types';

// ==========================================================
// Product Filter
// ==========================================================

export class ProductFilter {

  apply(
    records: ProductSearchRecord[],
    criteria: ProductSearchCriteria,
  ): ProductSearchRecord[] {

    return records.filter((record) => {

      if (criteria.sport && !equalsIgnoreCase(record.sportName, criteria.sport)) {
        return false;
      }

      if (criteria.brand && !equalsIgnoreCase(record.brandName, criteria.brand)) {
        return false;
      }

      if (criteria.category && !equalsIgnoreCase(record.categoryName, criteria.category)) {
        return false;
      }

      if (criteria.minPrice !== undefined && record.sellingPrice < criteria.minPrice) {
        return false;
      }

      if (criteria.maxPrice !== undefined && record.sellingPrice > criteria.maxPrice) {
        return false;
      }

      if (criteria.available !== undefined && record.available !== criteria.available) {
        return false;
      }

      return true;

    });

  }

}

function equalsIgnoreCase(
  left: string,
  right: string,
): boolean {

  return left.trim().toLowerCase() === right.trim().toLowerCase();

}

export const productFilter =
  new ProductFilter();
