export interface ProductGalleryImageViewModel {
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface ProductGalleryViewModel {
  primaryImage: ProductGalleryImageViewModel;
  images: ProductGalleryImageViewModel[];
}
