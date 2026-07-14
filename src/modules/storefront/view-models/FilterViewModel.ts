export interface FilterOptionViewModel {
  label: string;
  value: string;
  selected: boolean;
}

export interface FilterViewModel {
  actionUrl: string;
  search: string;
  sportOptions: FilterOptionViewModel[];
  brandOptions: FilterOptionViewModel[];
  categoryOptions: FilterOptionViewModel[];
  availabilityOptions: FilterOptionViewModel[];
  sortOptions: FilterOptionViewModel[];
  minPrice: string;
  maxPrice: string;
}
