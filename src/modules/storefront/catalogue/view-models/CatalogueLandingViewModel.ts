import { FeaturedProductViewModel } from '../../view-models';

export interface CatalogueHeroViewModel {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CatalogueCardViewModel {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  url: string;
}

export interface CatalogueBrandViewModel {
  id: string;
  name: string;
  logoUrl: string;
  url: string;
}

export interface CatalogueLandingViewModel {
  hero: CatalogueHeroViewModel;
  featuredSports: CatalogueCardViewModel[];
  featuredCategories: CatalogueCardViewModel[];
  featuredBrands: CatalogueBrandViewModel[];
  featuredProducts: FeaturedProductViewModel[];
}
