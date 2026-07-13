// ==========================================================
// Product Search Types
// ==========================================================

export type ProductSearchSort =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

export interface ProductSearchRequest {

  q?: string;

  sport?: string;

  brand?: string;

  category?: string;

  minPrice?: number;

  maxPrice?: number;

  available?: boolean;

  page?: number;

  pageSize?: number;

  sort?: ProductSearchSort;

}

export interface ProductSearchCriteria {

  q?: string;

  sport?: string;

  brand?: string;

  category?: string;

  minPrice?: number;

  maxPrice?: number;

  available?: boolean;

  page: number;

  pageSize: number;

  sort: ProductSearchSort;

}

export interface ProductSearchRecord {

  productId: string;

  productName: string;

  productSlug: string;

  productDescription: string;

  productCreatedAt: Date;

  brandName: string;

  categoryName: string;

  sportName: string;

  variantId: string;

  variantName: string;

  variantSku: string;

  sellingPrice: number;

  available: boolean;

}

export interface ProductSearchResultItem {

  productId: string;

  productName: string;

  productSlug: string;

  brand: string;

  category: string;

  sport: string;

  variantId: string;

  variantName: string;

  variantSku: string;

  sellingPrice: number;

  available: boolean;

}

export interface ProductSearchResponse {

  page: number;

  pageSize: number;

  total: number;

  results: ProductSearchResultItem[];

}

export interface ProductSearchEngineResult {

  total: number;

  records: ProductSearchRecord[];

}
