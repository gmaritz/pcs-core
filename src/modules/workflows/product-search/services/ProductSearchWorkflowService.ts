// ==========================================================
// Imports
// ==========================================================

import {
  productSearchController,
} from '../../../search';

import {
  ProductSearchQueryDto,
  ProductSearchWorkflowResponse,
} from '../types';

// ==========================================================
// Product Search Workflow Service
// ==========================================================

export class ProductSearchWorkflowService {

  async search(
    query: ProductSearchQueryDto,
  ): Promise<ProductSearchWorkflowResponse> {

    return productSearchController.search(
      query,
    );

  }

}

export const productSearchWorkflowService =
  new ProductSearchWorkflowService();
