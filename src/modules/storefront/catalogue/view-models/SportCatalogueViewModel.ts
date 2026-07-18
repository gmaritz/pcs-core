import {
  CatalogueBrandViewModel,
  CatalogueCardViewModel,
  CatalogueHeroViewModel,
} from './CatalogueLandingViewModel';
import {
  CatalogueBreadcrumbItemViewModel,
} from './shared';
import {
  FeaturedProductViewModel,
} from '../../view-models';

export interface SportCatalogueViewModel {
  slug: string;
  hero: CatalogueHeroViewModel;
  breadcrumbs: CatalogueBreadcrumbItemViewModel[];
  categories: CatalogueCardViewModel[];
  featuredBrands: CatalogueBrandViewModel[];
  featuredProducts: FeaturedProductViewModel[];
}
