// ==========================================================
// Imports
// ==========================================================

import {
  productSearchService,
} from '../services';
import {
  ProductSearchRequest,
  ProductSearchResponse,
} from '../types';

// ==========================================================
// Product Search Controller
// ==========================================================

export class ProductSearchController {

  async search(
    request: ProductSearchRequest,
  ): Promise<ProductSearchResponse> {

    return productSearchService.search(
      request,
    );

  }

}

export const productSearchController =
  new ProductSearchController();
