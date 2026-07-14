export interface BrandItemViewModel {
  id: string;
  name: string;
  logoUrl?: string;
  url: string;
  themeClass: string;
}

export interface BrandsViewModel {
  items: BrandItemViewModel[];
}
