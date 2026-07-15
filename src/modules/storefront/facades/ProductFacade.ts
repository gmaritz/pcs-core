import {
  Prisma,
  RecordStatus,
} from '@prisma/client';

import {
  PageMetadata,
  pageMetadataService,
} from '../../content';
import {
  mediaService,
} from '../../media';
import {
  recommendationService,
} from '../../recommendation';
import {
  productService,
} from '../../catalog/services';

import {
  ProductDetailViewModel,
  ProductGalleryImageViewModel,
  ProductSpecificationViewModel,
  RelatedProductViewModel,
} from '../view-models';

type ProductDetailRecord = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    category: true;
    sport: true;
    variants: {
      include: {
        inventory: true;
      };
    };
    productSpecifications: {
      include: {
        specification: true;
      };
    };
  };
}>;

export type ProductPageViewModel = {
  product: ProductDetailViewModel;
  metadata: PageMetadata;
};

export class ProductFacade {
  async buildProductPageViewModel(
    slug: string,
  ): Promise<ProductPageViewModel | null> {
    const products = await productService.getProducts({
      where: {
        slug,
        status: RecordStatus.ACTIVE,
        variants: {
          some: {
            status: RecordStatus.ACTIVE,
            sellingPrice: {
              not: null,
            },
          },
        },
      },
      include: {
        brand: true,
        category: true,
        sport: true,
        variants: {
          where: {
            status: RecordStatus.ACTIVE,
            sellingPrice: {
              not: null,
            },
          },
          include: {
            inventory: true,
          },
          orderBy: [
            {
              isDefault: 'desc',
            },
            {
              displayOrder: 'asc',
            },
            {
              createdAt: 'asc',
            },
          ],
        },
        productSpecifications: {
          where: {
            specification: {
              status: RecordStatus.ACTIVE,
            },
          },
          include: {
            specification: true,
          },
          orderBy: [
            {
              specification: {
                displayOrder: 'asc',
              },
            },
            {
              specification: {
                name: 'asc',
              },
            },
          ],
        },
      },
      take: 1,
    }) as ProductDetailRecord[];

    const product = products[0];

    if (!product) {
      return null;
    }

    const primaryVariant = product.variants[0];

    if (!primaryVariant || primaryVariant.sellingPrice === null) {
      return null;
    }

    const gallery = await mediaService.resolveProductGallery(
      product.id,
    );

    const recommendations = await recommendationService.resolveRelatedProducts({
      productId: product.id,
      categoryId: product.categoryId,
      brandId: product.brandId,
      sportId: product.sportId,
      limit: 4,
    });

    const recommendationImages = await mediaService.resolveProductImages(
      recommendations.map((item) => item.productId),
    );

    const description = (
      product.shortDescription ??
      product.description ??
      primaryVariant.description ??
      `${product.name} by ${product.brand.name}`
    );

    const isAvailable = this.resolveAvailability(
      primaryVariant.inventory,
    );

    const detail: ProductDetailViewModel = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brandName: product.brand.name,
      sportName: product.sport.name,
      categoryName: product.category.name,
      sku: primaryVariant.sku,
      description,
      formattedPrice: this.formatCurrency(Number(primaryVariant.sellingPrice)),
      availabilityLabel: isAvailable ? 'In Stock' : 'Out of Stock',
      isAvailable,
      gallery: {
        primaryImage: {
          ...gallery.primaryImage,
          isPrimary: true,
        },
        images: this.toGalleryImages(gallery.images),
      },
      specifications: this.mapSpecifications(
        product.productSpecifications,
      ),
      attributes: this.mapSpecifications(
        product.productSpecifications,
      ),
      relatedProducts: {
        heading: 'Related Products',
        products: recommendations.map((item) => {
          const media = recommendationImages[item.productId];

          const related: RelatedProductViewModel = {
            id: item.variantId,
            productId: item.productId,
            productName: item.productName,
            brandName: item.brandName,
            sportName: item.sportName,
            imageUrl: media.url,
            imageAlt: media.altText,
            formattedPrice: this.formatCurrency(item.sellingPrice),
            availabilityLabel: item.isAvailable ? 'In Stock' : 'Out of Stock',
            isAvailable: item.isAvailable,
            productUrl: `/product/${item.productSlug}`,
          };

          return related;
        }),
      },
      breadcrumbs: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'Shop',
          href: '/shop',
        },
        {
          label: product.sport.name,
          href: `/shop?sport=${encodeURIComponent(product.sport.slug)}`,
        },
        {
          label: product.category.name,
          href: `/shop?category=${encodeURIComponent(product.category.slug)}`,
        },
        {
          label: product.name,
        },
      ],
    };

    return {
      product: detail,
      metadata: pageMetadataService.buildProductPageMetadata({
        productName: product.name,
        brandName: product.brand.name,
        description,
        slug: product.slug,
        primaryImageUrl: gallery.primaryImage.url,
      }),
    };
  }

  private mapSpecifications(
    specifications: ProductDetailRecord['productSpecifications'],
  ): ProductSpecificationViewModel[] {
    return specifications.map((entry) => ({
      label: entry.specification.name,
      value: entry.specification.unit
        ? `${entry.value} ${entry.specification.unit}`
        : entry.value,
    }));
  }

  private toGalleryImages(
    images: Array<{
      url: string;
      altText: string;
    }>,
  ): ProductGalleryImageViewModel[] {
    const primaryUrl = images[0]?.url;

    return images.map((image) => ({
      url: image.url,
      altText: image.altText,
      isPrimary: image.url === primaryUrl,
    }));
  }

  private resolveAvailability(
    inventory: Array<{
      quantityOnHand: number;
      quantityReserved: number;
    }>,
  ): boolean {
    const availableQuantity = inventory.reduce(
      (sum, item) => (
        sum + (item.quantityOnHand - item.quantityReserved)
      ),
      0,
    );

    return availableQuantity > 0;
  }

  private formatCurrency(
    amount: number,
  ): string {
    return `R${new Intl.NumberFormat('en-ZA').format(amount)}`;
  }
}

export const productFacade =
  new ProductFacade();
