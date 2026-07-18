export interface CatalogueBreadcrumbItemViewModel {
  label: string;
  href: string;
}

export interface CatalogueFilterOptionViewModel {
  label: string;
  value: string;
  selected: boolean;
}

export interface CatalogueFilterSidebarViewModel {
  actionUrl: string;
  search: string;
  sportOptions: CatalogueFilterOptionViewModel[];
  categoryOptions: CatalogueFilterOptionViewModel[];
  brandOptions: CatalogueFilterOptionViewModel[];
  availabilityOptions: CatalogueFilterOptionViewModel[];
  performanceTierOptions: CatalogueFilterOptionViewModel[];
  minPrice: string;
  maxPrice: string;
}

export interface CatalogueSortOptionViewModel {
  label: string;
  value: string;
  selected: boolean;
}

export interface CatalogueSortToolbarViewModel {
  actionUrl: string;
  resultCount: number;
  sortOptions: CatalogueSortOptionViewModel[];
  selectedSort: string;
}

export interface CataloguePaginationItemViewModel {
  label: string;
  page: number;
  isCurrent: boolean;
  url: string;
}

export interface CataloguePaginationViewModel {
  totalResults: number;
  currentPage: number;
  totalPages: number;
  previousUrl?: string;
  nextUrl?: string;
  pages: CataloguePaginationItemViewModel[];
}

export interface CataloguePageMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
}
