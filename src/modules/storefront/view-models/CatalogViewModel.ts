import {
  FilterViewModel,
} from './FilterViewModel';
import {
  PaginationViewModel,
} from './PaginationViewModel';
import {
  ProductCardViewModel,
} from './ProductCardViewModel';

export interface CatalogViewModel {
  heading: string;
  description: string;
  products: ProductCardViewModel[];
  filters: FilterViewModel;
  pagination: PaginationViewModel;
  resultSummary: string;
  emptyStateMessage: string;
  returnToShopUrl: string;
}
