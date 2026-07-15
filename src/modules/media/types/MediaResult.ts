export interface MediaResult {
  url: string;
  altText: string;
}

export interface ProductGalleryResult {
  primaryImage: MediaResult;
  images: MediaResult[];
}
