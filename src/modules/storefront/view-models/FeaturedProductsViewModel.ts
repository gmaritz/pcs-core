export interface FeaturedProductViewModel {
  id: string;
  name: string;
  description: string;
  brandName: string;
  sportName: string;
  imageUrl: string;
  imageAlt: string;
  formattedPrice: string;
  stockLabel: string;
  stockState: 'in' | 'limited' | 'out';
  availabilityLabel: string;
  isOutOfStock: boolean;
  url: string;
  brandClass: string;
  badgeLabel?: string;
}

export interface FeaturedProductsViewModel {
  items: FeaturedProductViewModel[];
}
