import {
  FeaturedProductViewModel,
} from '../../../view-models';
import {
  storefrontPresentationService,
} from '../../../services';
import {
  ProductSearchResultItem,
} from '../../../../search';
import {
  CatalogueBreadcrumbItemViewModel,
  CatalogueFilterOptionViewModel,
  CatalogueFilterSidebarViewModel,
  CataloguePaginationItemViewModel,
  CataloguePaginationViewModel,
  CatalogueSortOptionViewModel,
  CatalogueSortToolbarViewModel,
} from '../../view-models';

const PRICE_PLACEHOLDER = '/images/products/wilson-clash.jpeg';

export class CataloguePresentationService {
  buildBreadcrumbs(
    items: Array<{ label: string; href: string }>,
  ): CatalogueBreadcrumbItemViewModel[] {
    return items;
  }

  buildProductCards(
    items: ProductSearchResultItem[],
    mediaMap: Record<string, { url: string; altText: string }>,
  ): FeaturedProductViewModel[] {
    return items.map((item) => {
      const media = mediaMap[item.productId] ?? {
        url: PRICE_PLACEHOLDER,
        altText: 'Product image placeholder',
      };

      return {
        id: item.variantId,
        name: item.productName,
        description: `${item.brand} ${item.category}`,
        brandName: item.brand,
        sportName: item.sport,
        imageUrl: media.url,
        imageAlt: media.altText,
        formattedPrice: `R${new Intl.NumberFormat('en-ZA').format(item.sellingPrice)}`,
        stockLabel: item.available ? 'In stock' : 'Out of stock',
        stockState: item.available ? 'in' : 'out',
        availabilityLabel: item.available ? 'In Stock' : 'Out of Stock',
        isOutOfStock: !item.available,
        url: `/product/${item.productSlug}`,
        brandClass: storefrontPresentationService.resolveBrandThemeClass(
          item.brand.toLowerCase().replace(/\s+/g, '-'),
        ),
      };
    });
  }

  buildFilterOptions(
    options: Array<{ name: string; slug: string }>,
    selectedSlug?: string,
  ): CatalogueFilterOptionViewModel[] {
    return options.map((option) => ({
      label: option.name,
      value: option.slug,
      selected: option.slug === selectedSlug,
    }));
  }

  buildFilterSidebar(input: {
    actionUrl: string;
    search: string;
    sportOptions: CatalogueFilterOptionViewModel[];
    categoryOptions: CatalogueFilterOptionViewModel[];
    brandOptions: CatalogueFilterOptionViewModel[];
    selectedAvailability: string;
    selectedTier: string;
    minPrice?: number;
    maxPrice?: number;
  }): CatalogueFilterSidebarViewModel {
    return {
      actionUrl: input.actionUrl,
      search: input.search,
      sportOptions: input.sportOptions,
      categoryOptions: input.categoryOptions,
      brandOptions: input.brandOptions,
      availabilityOptions: [
        { label: 'All', value: 'all', selected: input.selectedAvailability === 'all' },
        { label: 'In Stock', value: 'true', selected: input.selectedAvailability === 'true' },
        { label: 'Out of Stock', value: 'false', selected: input.selectedAvailability === 'false' },
      ],
      performanceTierOptions: [
        { label: 'All Tiers', value: 'all', selected: input.selectedTier === 'all' },
        { label: 'Performance', value: 'performance', selected: input.selectedTier === 'performance' },
        { label: 'Competition', value: 'competition', selected: input.selectedTier === 'competition' },
        { label: 'Elite', value: 'elite', selected: input.selectedTier === 'elite' },
      ],
      minPrice: input.minPrice?.toString() ?? '',
      maxPrice: input.maxPrice?.toString() ?? '',
    };
  }

  buildSortToolbar(input: {
    actionUrl: string;
    resultCount: number;
    selectedSort: string;
    sortOptions: Array<{ value: string; label: string }>;
  }): CatalogueSortToolbarViewModel {
    const sortOptions: CatalogueSortOptionViewModel[] =
      input.sortOptions.map((option) => ({
        label: option.label,
        value: option.value,
        selected: option.value === input.selectedSort,
      }));

    return {
      actionUrl: input.actionUrl,
      resultCount: input.resultCount,
      sortOptions,
      selectedSort: input.selectedSort,
    };
  }

  buildPagination(input: {
    totalResults: number;
    currentPage: number;
    totalPages: number;
    buildUrl: (page: number) => string;
  }): CataloguePaginationViewModel {
    const windowStart = Math.max(1, input.currentPage - 2);
    const windowEnd = Math.min(input.totalPages, input.currentPage + 2);

    const pages: CataloguePaginationItemViewModel[] = [];

    for (let page = windowStart; page <= windowEnd; page += 1) {
      pages.push({
        label: page.toString(),
        page,
        isCurrent: page === input.currentPage,
        url: input.buildUrl(page),
      });
    }

    return {
      totalResults: input.totalResults,
      currentPage: input.currentPage,
      totalPages: input.totalPages,
      previousUrl: input.currentPage > 1
        ? input.buildUrl(input.currentPage - 1)
        : undefined,
      nextUrl: input.currentPage < input.totalPages
        ? input.buildUrl(input.currentPage + 1)
        : undefined,
      pages,
    };
  }
}

export const cataloguePresentationService =
  new CataloguePresentationService();
