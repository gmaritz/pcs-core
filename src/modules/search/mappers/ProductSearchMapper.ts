// ==========================================================
// Imports
// ==========================================================

import {
  ProductSearchRecord,
  ProductSearchResultItem,
} from '../types';

// ==========================================================
// Product Search Mapper
// ==========================================================

export class ProductSearchMapper {

  toResultItem(
    record: ProductSearchRecord,
  ): ProductSearchResultItem {

    return {
      productId: record.productId,
      productName: record.productName,
      productSlug: record.productSlug,
      brand: record.brandName,
      category: record.categoryName,
      sport: record.sportName,
      variantId: record.variantId,
      variantName: record.variantName,
      variantSku: record.variantSku,
      sellingPrice: record.sellingPrice,
      available: record.available,
    };

  }

}

export const productSearchMapper =
  new ProductSearchMapper();
