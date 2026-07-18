import {
  CatalogueCardViewModel,
  CatalogueHeroViewModel,
} from './CatalogueLandingViewModel';
import {
  CatalogueBreadcrumbItemViewModel,
  CataloguePaginationViewModel,
  CatalogueSortToolbarViewModel,
} from './shared';
import {
  FeaturedProductViewModel,
} from '../../view-models';

export interface BrandCatalogueViewModel {
  slug: string;
  hero: CatalogueHeroViewModel;
  breadcrumbs: CatalogueBreadcrumbItemViewModel[];
  description: string;
  featuredCategories: CatalogueCardViewModel[];
  products: FeaturedProductViewModel[];
  sortToolbar: CatalogueSortToolbarViewModel;
  pagination: CataloguePaginationViewModel;
  resultSummary: string;
}
