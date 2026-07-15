export interface RelatedProductViewModel {
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  sportName: string;
  imageUrl: string;
  imageAlt: string;
  formattedPrice: string;
  availabilityLabel: string;
  isAvailable: boolean;
  productUrl: string;
}

export interface RelatedProductsViewModel {
  heading: string;
  products: RelatedProductViewModel[];
}
