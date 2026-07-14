export interface FeaturedProductViewModel {
  id: string;
  name: string;
  description: string;
  brandName: string;
  sportName: string;
  imageUrl: string;
  imageAlt: string;
  formattedPrice: string;
  availabilityLabel: string;
  isOutOfStock: boolean;
  url: string;
  brandClass: string;
}

export interface FeaturedProductsViewModel {
  items: FeaturedProductViewModel[];
}
