import {
  BreadcrumbViewModel,
} from './BreadcrumbViewModel';
import {
  ProductGalleryViewModel,
} from './ProductGalleryViewModel';
import {
  ProductSpecificationViewModel,
} from './ProductSpecificationViewModel';
import {
  RelatedProductsViewModel,
} from './RelatedProductsViewModel';

export interface ProductDetailViewModel {
  id: string;
  name: string;
  slug: string;
  brandName: string;
  sportName: string;
  categoryName: string;
  sku: string;
  description: string;
  formattedPrice: string;
  availabilityLabel: string;
  isAvailable: boolean;
  gallery: ProductGalleryViewModel;
  specifications: ProductSpecificationViewModel[];
  attributes: ProductSpecificationViewModel[];
  relatedProducts: RelatedProductsViewModel;
  breadcrumbs: BreadcrumbViewModel[];
}
