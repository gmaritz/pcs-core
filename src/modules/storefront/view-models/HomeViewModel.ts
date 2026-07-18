import { BrandsViewModel } from './BrandsViewModel';
import { CategoriesViewModel } from './CategoriesViewModel';
import { FeaturedProductsViewModel } from './FeaturedProductsViewModel';
import { HeroStatisticsViewModel } from './HeroStatisticsViewModel';
import { SportsViewModel } from './SportsViewModel';

export interface AnnouncementViewModel {
  message: string;
}

export interface HeaderNavigationItemViewModel {
  label: string;
  href: string;
}

export interface HeaderViewModel {
  logoUrl: string;
  logoAlt: string;
  navigation: HeaderNavigationItemViewModel[];
  searchUrl: string;
  accountUrl: string;
  cartUrl: string;
}

export interface HeroViewModel {
  headline: string;
  supportingText: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  imageUrl: string;
  imageAlt: string;
}

export interface TrustCardViewModel {
  icon: string;
  title: string;
  description: string;
}

export interface NewsletterViewModel {
  heading: string;
  subheading: string;
  emailPlaceholder: string;
  buttonLabel: string;
  actionUrl: string;
}

export interface HomeViewModel {
  announcement: AnnouncementViewModel;
  header: HeaderViewModel;
  hero: HeroViewModel;
  featuredSports: SportsViewModel;
  featuredCategories: CategoriesViewModel;
  featuredProducts: FeaturedProductsViewModel;
  featuredBrands: BrandsViewModel;
  trustCards: TrustCardViewModel[];
  newsletter: NewsletterViewModel;
  currentYear: number;

  // Backward compatibility for existing integrations.
  heroStatistics: HeroStatisticsViewModel;
  brands: BrandsViewModel;
  categories: CategoriesViewModel;
  sports: SportsViewModel;
  searchAction: string;
}
