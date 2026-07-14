import { BrandsViewModel } from './BrandsViewModel';
import { CategoriesViewModel } from './CategoriesViewModel';
import { FeaturedProductsViewModel } from './FeaturedProductsViewModel';
import { HeroStatisticsViewModel } from './HeroStatisticsViewModel';
import { SportsViewModel } from './SportsViewModel';

export interface HomeViewModel {
  heroStatistics: HeroStatisticsViewModel;
  featuredProducts: FeaturedProductsViewModel;
  brands: BrandsViewModel;
  categories: CategoriesViewModel;
  sports: SportsViewModel;
  searchAction: string;
}
