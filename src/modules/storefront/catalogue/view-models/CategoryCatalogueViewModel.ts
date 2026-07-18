import {
  CatalogueHeroViewModel,
} from './CatalogueLandingViewModel';
import {
  FeaturedProductViewModel,
} from '../../view-models';
import {
  CatalogueBreadcrumbItemViewModel,
  CatalogueFilterSidebarViewModel,
  CataloguePaginationViewModel,
  CatalogueSortToolbarViewModel,
} from './shared';

export interface CategoryCatalogueViewModel {
  sportSlug: string;
  categorySlug: string;
  hero: CatalogueHeroViewModel;
  breadcrumbs: CatalogueBreadcrumbItemViewModel[];
  filters: CatalogueFilterSidebarViewModel;
  sortToolbar: CatalogueSortToolbarViewModel;
  products: FeaturedProductViewModel[];
  pagination: CataloguePaginationViewModel;
  resultSummary: string;
  emptyStateMessage: string;
}
