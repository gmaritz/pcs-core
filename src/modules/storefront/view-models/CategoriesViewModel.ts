export interface CategoryItemViewModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
  formattedProductCount: string;
  url: string;
}

export interface CategoriesViewModel {
  items: CategoryItemViewModel[];
}
