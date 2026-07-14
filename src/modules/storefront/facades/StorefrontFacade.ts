import {
  MediaRole,
  Prisma,
  RecordStatus,
} from '@prisma/client';

import {
  brandService,
  categoryService,
  productService,
  sportService,
} from '../../catalog/services';

import {
  HomeViewModel,
  HeroStatisticsViewModel,
} from '../view-models';
import {
  HeroStatisticInput,
} from '../types';
import {
  storefrontPresentationService,
} from '../services';

const SEARCH_ACTION_URL = '/api/v1/products/search';
const FEATURED_PRODUCTS_LIMIT = 8;

type FeaturedProductRecord = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    sport: true;
    variants: {
      include: {
        inventory: true;
      };
    };
    media: {
      include: {
        media: true;
      };
    };
  };
}>;

type CategoryRecord = Prisma.CategoryGetPayload<{
  include: {
    products: {
      select: {
        id: true;
      };
    };
  };
}>;

export class StorefrontFacade {
  async buildHomeViewModel(): Promise<HomeViewModel> {
    const [
      heroStatistics,
      featuredProducts,
      brands,
      categories,
      sports,
    ] = await Promise.all([
      this.buildHeroStatistics(),
      this.buildFeaturedProducts(),
      this.buildBrands(),
      this.buildCategories(),
      this.buildSports(),
    ]);

    return {
      heroStatistics,
      featuredProducts,
      brands,
      categories,
      sports,
      searchAction: SEARCH_ACTION_URL,
    };
  }

  private async buildHeroStatistics(): Promise<HeroStatisticsViewModel> {
    const [products, brands, sports, categories] = await Promise.all([
      productService.getProducts({
        where: {
          status: RecordStatus.ACTIVE,
        },
        select: {
          id: true,
        },
      }),
      brandService.getBrands({
        where: {
          status: RecordStatus.ACTIVE,
        },
        select: {
          id: true,
        },
      }),
      sportService.getSports({
        where: {
          status: RecordStatus.ACTIVE,
        },
        select: {
          id: true,
        },
      }),
      categoryService.getCategories({
        where: {
          status: RecordStatus.ACTIVE,
        },
        select: {
          id: true,
        },
      }),
    ]);

    const items: HeroStatisticInput[] = [
      {
        label: 'Active Products',
        value: products.length,
        description: 'Live catalogue products ready for storefront discovery',
      },
      {
        label: 'Active Brands',
        value: brands.length,
        description: 'Verified supplier-backed brands in the current range',
      },
      {
        label: 'Court Sports',
        value: sports.length,
        description: 'Specialist sports currently supported by PCS Core',
      },
      {
        label: 'Categories',
        value: categories.length,
        description: 'Structured product categories available for browsing',
      },
    ];

    return {
      items: items.map((item) => ({
        ...item,
        formattedValue:
          storefrontPresentationService.formatInteger(
            item.value,
          ),
      })),
    };
  }

  private async buildFeaturedProducts() {
    const products = await productService.getProducts({
      where: {
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
        sport: true,
        variants: {
          where: {
            status: RecordStatus.ACTIVE,
            sellingPrice: {
              not: null,
            },
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
          include: {
            inventory: true,
          },
        },
        media: {
          orderBy: [
            {
              isPrimary: 'desc',
            },
            {
              displayOrder: 'asc',
            },
          ],
          include: {
            media: true,
          },
        },
      },
      orderBy: [
        {
          isFeatured: 'desc',
        },
        {
          displayOrder: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
      take: FEATURED_PRODUCTS_LIMIT,
    }) as FeaturedProductRecord[];

    return {
      items: products.map((product) => {
        const variant = product.variants[0];
        const primaryMedia = product.media.find((entry) => (
          entry.isPrimary ||
          entry.mediaRole === MediaRole.PRIMARY ||
          entry.mediaRole === MediaRole.HERO
        ));

        const imageUrl = primaryMedia?.media.url ??
          '/images/products/wilson-clash.jpeg';

        const availableQuantity = variant.inventory.reduce(
          (sum: number, inventory) => (
            sum + (inventory.quantityOnHand - inventory.quantityReserved)
          ),
          0,
        );

        const isOutOfStock = availableQuantity <= 0;

        return {
          id: product.id,
          name: variant.name,
          description: product.shortDescription ??
            product.description ??
            variant.description ??
            'Premium performance product selected for specialist players.',
          brandName: product.brand.name,
          sportName: product.sport.name,
          imageUrl,
          imageAlt: variant.name,
          formattedPrice:
            storefrontPresentationService.formatPrice(
              Number(variant.sellingPrice),
            ),
          availabilityLabel:
            isOutOfStock ? 'Out of Stock' : 'In Stock',
          isOutOfStock,
          url: `/product/${product.slug}`,
          brandClass:
            storefrontPresentationService.resolveBrandThemeClass(
              product.brand.slug,
            ),
        };
      }),
    };
  }

  private async buildBrands() {
    const brands = await brandService.getBrands({
      where: {
        status: RecordStatus.ACTIVE,
      },
      orderBy: [
        {
          displayOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
      take: 10,
    });

    return {
      items: brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        logoUrl: brand.logoUrl ?? undefined,
        url: `/brands?brand=${brand.slug}`,
        themeClass:
          storefrontPresentationService.resolveBrandThemeClass(
            brand.slug,
          ),
      })),
    };
  }

  private async buildCategories() {
    const categories = await categoryService.getCategories({
      where: {
        status: RecordStatus.ACTIVE,
      },
      include: {
        products: {
          where: {
            status: RecordStatus.ACTIVE,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        {
          displayOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
      take: 8,
    }) as CategoryRecord[];

    return {
      items: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description:
          storefrontPresentationService.resolveCategoryDescription(
            category.name,
          ),
        imageUrl:
          storefrontPresentationService.resolveCategoryImage(
            category.slug,
          ),
        productCount: category.products.length,
        formattedProductCount:
          storefrontPresentationService.formatInteger(
            category.products.length,
          ),
        url: `/category/${category.slug}`,
      })),
    };
  }

  private async buildSports() {
    const sports = await sportService.getSports({
      where: {
        status: RecordStatus.ACTIVE,
      },
      orderBy: [
        {
          displayOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
      take: 6,
    });

    return {
      items: sports.map((sport) => ({
        id: sport.id,
        name: sport.name,
        description:
          storefrontPresentationService.resolveSportDescription(
            sport.name,
            sport.description,
          ),
        tagline:
          storefrontPresentationService.resolveSportTagline(
            sport.slug,
          ),
        heroImageUrl:
          storefrontPresentationService.resolveSportImage(
            sport.slug,
          ),
        heroImageAlt: `${sport.name} equipment`,
        statusLabel: 'Catalog Launching Soon',
        url: `/sports?sport=${sport.slug}`,
      })),
    };
  }
}

export const storefrontFacade =
  new StorefrontFacade();
