import {
  RecordStatus,
} from '@prisma/client';

import {
  brandService,
  categoryService,
  sportService,
} from '../../catalog/services';
import {
  pageMetadataService,
} from '../../content';
import {
  mediaService,
} from '../../media';
import {
  ProductSearchSort,
} from '../../search';
import {
  productSearchWorkflowService,
} from '../../workflows/product-search/services';

import {
  CatalogPageViewModel,
  FilterOptionViewModel,
  FilterViewModel,
  PaginationPageViewModel,
  PaginationViewModel,
  ProductCardViewModel,
} from '../view-models';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const CATALOG_HEADING = 'Shop Catalogue';
const CATALOG_DESCRIPTION =
  'Discover premium court sports equipment from specialist international brands.';

const SORT_OPTIONS: Array<{
  value: ProductSearchSort;
  label: string;
}> = [
  {
    value: 'relevance',
    label: 'Relevance',
  },
  {
    value: 'newest',
    label: 'Newest',
  },
  {
    value: 'price-asc',
    label: 'Price Low to High',
  },
  {
    value: 'price-desc',
    label: 'Price High to Low',
  },
  {
    value: 'name-asc',
    label: 'Name A to Z',
  },
  {
    value: 'name-desc',
    label: 'Name Z to A',
  },
];

type CatalogRequestQuery = Record<string, unknown>;

type Option = {
  name: string;
  slug: string;
};

interface CatalogCriteria {
  q?: string;
  sport?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  page: number;
  pageSize: number;
  sort: ProductSearchSort;
}

export class CatalogFacade {
  async buildCatalogPageViewModel(
    query: CatalogRequestQuery,
  ): Promise<CatalogPageViewModel> {
    const [sports, brands, categories] = await Promise.all([
      this.loadSports(),
      this.loadBrands(),
      this.loadCategories(),
    ]);

    const criteria = this.parseCriteria(
      query,
      sports,
      brands,
      categories,
    );

    const searchResult = await productSearchWorkflowService.search({
      q: criteria.q,
      sport: criteria.sport,
      brand: criteria.brand,
      category: criteria.category,
      minPrice: criteria.minPrice,
      maxPrice: criteria.maxPrice,
      available: criteria.available,
      page: criteria.page,
      pageSize: criteria.pageSize,
      sort: criteria.sort,
    });

    const mediaMap = await mediaService.resolveProductImages(
      Array.from(
        new Set(searchResult.results.map((item) => item.productId)),
      ),
    );

    const products: ProductCardViewModel[] =
      searchResult.results.map((item) => {
        const media = mediaMap[item.productId];
        const isAvailable = item.available;

        return {
          id: item.variantId,
          productId: item.productId,
          productName: item.productName,
          brandName: item.brand,
          sportName: item.sport,
          imageUrl: media.url,
          imageAlt: media.altText,
          formattedPrice: this.formatCurrency(item.sellingPrice),
          availabilityLabel: isAvailable ? 'In Stock' : 'Out of Stock',
          isAvailable,
          quickViewUrl: '#',
          productUrl: `/product/${item.productSlug}`,
        };
      });

    const totalPages = Math.max(
      1,
      Math.ceil(searchResult.total / criteria.pageSize),
    );

    const selectedSport = this.resolveSlugFromInput(query.sport, sports);
    const selectedBrand = this.resolveSlugFromInput(query.brand, brands);
    const selectedCategory = this.resolveSlugFromInput(query.category, categories);

    const selectedAvailability = this.resolveAvailabilityInput(query.available);
    const selectedSort = criteria.sort;

    const filters = this.buildFilters({
      search: criteria.q ?? '',
      selectedSport,
      selectedBrand,
      selectedCategory,
      selectedAvailability,
      selectedSort,
      minPrice: criteria.minPrice,
      maxPrice: criteria.maxPrice,
      sports,
      brands,
      categories,
    });

    const pagination = this.buildPagination({
      totalResults: searchResult.total,
      currentPage: criteria.page,
      totalPages,
      query: {
        q: criteria.q,
        sport: selectedSport,
        brand: selectedBrand,
        category: selectedCategory,
        minPrice: criteria.minPrice,
        maxPrice: criteria.maxPrice,
        available: selectedAvailability,
        sort: selectedSort,
      },
    });

    const rangeStart = searchResult.total === 0
      ? 0
      : ((criteria.page - 1) * criteria.pageSize) + 1;
    const rangeEnd = Math.min(
      criteria.page * criteria.pageSize,
      searchResult.total,
    );

    return {
      metadata: pageMetadataService.buildCatalogPageMetadata(),
      catalog: {
        heading: CATALOG_HEADING,
        description: CATALOG_DESCRIPTION,
        products,
        filters,
        pagination,
        resultSummary: searchResult.total === 0
          ? 'No results found.'
          : `Showing ${rangeStart} to ${rangeEnd} of ${searchResult.total} products`,
        emptyStateMessage: 'No products matched your search.',
        returnToShopUrl: '/shop',
      },
    };
  }

  private async loadSports(): Promise<Option[]> {
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
      select: {
        name: true,
        slug: true,
      },
    });

    return sports;
  }

  private async loadBrands(): Promise<Option[]> {
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
      select: {
        name: true,
        slug: true,
      },
    });

    return brands;
  }

  private async loadCategories(): Promise<Option[]> {
    const categories = await categoryService.getCategories({
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
      select: {
        name: true,
        slug: true,
      },
    });

    return categories;
  }

  private parseCriteria(
    query: CatalogRequestQuery,
    sports: Option[],
    brands: Option[],
    categories: Option[],
  ): CatalogCriteria {
    const page = this.parsePositiveInteger(query.page) ?? DEFAULT_PAGE;
    const pageSize = this.parsePositiveInteger(query.pageSize) ?? DEFAULT_PAGE_SIZE;

    const sortInput = this.parseString(query.sort);
    const sort: ProductSearchSort = SORT_OPTIONS.some((option) => (
      option.value === sortInput
    ))
      ? (sortInput as ProductSearchSort)
      : 'relevance';

    const minPrice = this.parsePositiveNumber(query.minPrice);
    const maxPrice = this.parsePositiveNumber(query.maxPrice);
    const normalizedRange =
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
        ? {
          minPrice: maxPrice,
          maxPrice: minPrice,
        }
        : {
          minPrice,
          maxPrice,
        };

    return {
      q: this.parseString(query.q),
      sport: this.resolveNameFromInput(query.sport, sports),
      brand: this.resolveNameFromInput(query.brand, brands),
      category: this.resolveNameFromInput(query.category, categories),
      minPrice: normalizedRange.minPrice,
      maxPrice: normalizedRange.maxPrice,
      available: this.parseAvailableBoolean(query.available),
      page,
      pageSize,
      sort,
    };
  }

  private buildFilters(input: {
    search: string;
    selectedSport?: string;
    selectedBrand?: string;
    selectedCategory?: string;
    selectedAvailability: string;
    selectedSort: ProductSearchSort;
    minPrice?: number;
    maxPrice?: number;
    sports: Option[];
    brands: Option[];
    categories: Option[];
  }): FilterViewModel {
    return {
      actionUrl: '/shop',
      search: input.search,
      sportOptions: this.buildFilterOptions(input.sports, input.selectedSport),
      brandOptions: this.buildFilterOptions(input.brands, input.selectedBrand),
      categoryOptions: this.buildFilterOptions(input.categories, input.selectedCategory),
      availabilityOptions: [
        {
          label: 'All',
          value: 'all',
          selected: input.selectedAvailability === 'all',
        },
        {
          label: 'In Stock',
          value: 'true',
          selected: input.selectedAvailability === 'true',
        },
        {
          label: 'Out of Stock',
          value: 'false',
          selected: input.selectedAvailability === 'false',
        },
      ],
      sortOptions: SORT_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
        selected: option.value === input.selectedSort,
      })),
      minPrice: input.minPrice?.toString() ?? '',
      maxPrice: input.maxPrice?.toString() ?? '',
    };
  }

  private buildFilterOptions(
    options: Option[],
    selected?: string,
  ): FilterOptionViewModel[] {
    return options.map((option) => ({
      label: option.name,
      value: option.slug,
      selected: option.slug === selected,
    }));
  }

  private buildPagination(input: {
    totalResults: number;
    currentPage: number;
    totalPages: number;
    query: {
      q?: string;
      sport?: string;
      brand?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      available?: string;
      sort: ProductSearchSort;
    };
  }): PaginationViewModel {
    const pages: PaginationPageViewModel[] = [];

    const windowStart = Math.max(1, input.currentPage - 2);
    const windowEnd = Math.min(input.totalPages, input.currentPage + 2);

    for (let page = windowStart; page <= windowEnd; page += 1) {
      pages.push({
        page,
        label: page.toString(),
        isCurrent: page === input.currentPage,
        url: this.buildShopUrl({
          ...input.query,
          page,
        }),
      });
    }

    return {
      currentPage: input.currentPage,
      totalPages: input.totalPages,
      totalResults: input.totalResults,
      previousUrl: input.currentPage > 1
        ? this.buildShopUrl({
          ...input.query,
          page: input.currentPage - 1,
        })
        : undefined,
      nextUrl: input.currentPage < input.totalPages
        ? this.buildShopUrl({
          ...input.query,
          page: input.currentPage + 1,
        })
        : undefined,
      pages,
    };
  }

  private buildShopUrl(input: {
    q?: string;
    sport?: string;
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: string;
    sort?: ProductSearchSort;
    page?: number;
  }): string {
    const params = new URLSearchParams();

    this.setOptionalQueryParam(params, 'q', input.q);
    this.setOptionalQueryParam(params, 'sport', input.sport);
    this.setOptionalQueryParam(params, 'brand', input.brand);
    this.setOptionalQueryParam(params, 'category', input.category);
    this.setOptionalQueryParam(params, 'minPrice', input.minPrice?.toString());
    this.setOptionalQueryParam(params, 'maxPrice', input.maxPrice?.toString());

    if (input.available && input.available !== 'all') {
      params.set('available', input.available);
    }

    this.setOptionalQueryParam(params, 'sort', input.sort);

    if (input.page && input.page > 1) {
      params.set('page', input.page.toString());
    }

    const query = params.toString();

    if (!query) {
      return '/shop';
    }

    return `/shop?${query}`;
  }

  private setOptionalQueryParam(
    params: URLSearchParams,
    key: string,
    value?: string,
  ): void {
    if (!value?.trim()) {
      return;
    }

    params.set(key, value);
  }

  private parseString(
    value: unknown,
  ): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      return undefined;
    }

    return trimmed;
  }

  private parsePositiveNumber(
    value: unknown,
  ): number | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return undefined;
    }

    return parsed;
  }

  private parsePositiveInteger(
    value: unknown,
  ): number | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
      return undefined;
    }

    return parsed;
  }

  private parseAvailableBoolean(
    value: unknown,
  ): boolean | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.trim().toLowerCase();

    if (normalized === 'true' || normalized === '1') {
      return true;
    }

    if (normalized === 'false' || normalized === '0') {
      return false;
    }

    return undefined;
  }

  private resolveAvailabilityInput(
    value: unknown,
  ): string {
    if (typeof value !== 'string') {
      return 'all';
    }

    const normalized = value.trim().toLowerCase();

    if (normalized === 'true' || normalized === '1') {
      return 'true';
    }

    if (normalized === 'false' || normalized === '0') {
      return 'false';
    }

    return 'all';
  }

  private resolveNameFromInput(
    value: unknown,
    options: Option[],
  ): string | undefined {
    const normalized = this.parseString(value)?.toLowerCase();

    if (!normalized) {
      return undefined;
    }

    const matched = options.find((option) => (
      option.slug.toLowerCase() === normalized ||
      option.name.toLowerCase() === normalized
    ));

    if (!matched) {
      return this.parseString(value);
    }

    return matched.name;
  }

  private resolveSlugFromInput(
    value: unknown,
    options: Option[],
  ): string | undefined {
    const normalized = this.parseString(value)?.toLowerCase();

    if (!normalized) {
      return undefined;
    }

    const matched = options.find((option) => (
      option.slug.toLowerCase() === normalized ||
      option.name.toLowerCase() === normalized
    ));

    return matched?.slug;
  }

  private formatCurrency(
    amount: number,
  ): string {
    return `R${new Intl.NumberFormat('en-ZA').format(amount)}`;
  }
}

export const catalogFacade =
  new CatalogFacade();
