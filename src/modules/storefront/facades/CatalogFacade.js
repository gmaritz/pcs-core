"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogFacade = exports.CatalogFacade = void 0;
const client_1 = require("@prisma/client");
const services_1 = require("../../catalog/services");
const content_1 = require("../../content");
const media_1 = require("../../media");
const services_2 = require("../../workflows/product-search/services");
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const CATALOG_HEADING = 'Shop Catalogue';
const CATALOG_DESCRIPTION = 'Discover premium court sports equipment from specialist international brands.';
const SORT_OPTIONS = [
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
class CatalogFacade {
    async buildCatalogPageViewModel(query) {
        const [sports, brands, categories] = await Promise.all([
            this.loadSports(),
            this.loadBrands(),
            this.loadCategories(),
        ]);
        const criteria = this.parseCriteria(query, sports, brands, categories);
        const searchResult = await services_2.productSearchWorkflowService.search({
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
        const mediaMap = await media_1.mediaService.resolveProductImages(Array.from(new Set(searchResult.results.map((item) => item.productId))));
        const products = searchResult.results.map((item) => {
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
        const totalPages = Math.max(1, Math.ceil(searchResult.total / criteria.pageSize));
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
        const rangeEnd = Math.min(criteria.page * criteria.pageSize, searchResult.total);
        return {
            metadata: content_1.pageMetadataService.buildCatalogPageMetadata(),
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
    async loadSports() {
        const sports = await services_1.sportService.getSports({
            where: {
                status: client_1.RecordStatus.ACTIVE,
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
    async loadBrands() {
        const brands = await services_1.brandService.getBrands({
            where: {
                status: client_1.RecordStatus.ACTIVE,
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
    async loadCategories() {
        const categories = await services_1.categoryService.getCategories({
            where: {
                status: client_1.RecordStatus.ACTIVE,
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
    parseCriteria(query, sports, brands, categories) {
        const page = this.parsePositiveInteger(query.page) ?? DEFAULT_PAGE;
        const pageSize = this.parsePositiveInteger(query.pageSize) ?? DEFAULT_PAGE_SIZE;
        const sortInput = this.parseString(query.sort);
        const sort = SORT_OPTIONS.some((option) => (option.value === sortInput))
            ? sortInput
            : 'relevance';
        const minPrice = this.parsePositiveNumber(query.minPrice);
        const maxPrice = this.parsePositiveNumber(query.maxPrice);
        const normalizedRange = minPrice !== undefined &&
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
    buildFilters(input) {
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
    buildFilterOptions(options, selected) {
        return options.map((option) => ({
            label: option.name,
            value: option.slug,
            selected: option.slug === selected,
        }));
    }
    buildPagination(input) {
        const pages = [];
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
    buildShopUrl(input) {
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
    setOptionalQueryParam(params, key, value) {
        if (!value?.trim()) {
            return;
        }
        params.set(key, value);
    }
    parseString(value) {
        if (typeof value !== 'string') {
            return undefined;
        }
        const trimmed = value.trim();
        if (!trimmed) {
            return undefined;
        }
        return trimmed;
    }
    parsePositiveNumber(value) {
        if (typeof value !== 'string') {
            return undefined;
        }
        const parsed = Number(value);
        if (!Number.isFinite(parsed) || parsed < 0) {
            return undefined;
        }
        return parsed;
    }
    parsePositiveInteger(value) {
        if (typeof value !== 'string') {
            return undefined;
        }
        const parsed = Number(value);
        if (!Number.isInteger(parsed) || parsed < 1) {
            return undefined;
        }
        return parsed;
    }
    parseAvailableBoolean(value) {
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
    resolveAvailabilityInput(value) {
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
    resolveNameFromInput(value, options) {
        const normalized = this.parseString(value)?.toLowerCase();
        if (!normalized) {
            return undefined;
        }
        const matched = options.find((option) => (option.slug.toLowerCase() === normalized ||
            option.name.toLowerCase() === normalized));
        if (!matched) {
            return this.parseString(value);
        }
        return matched.name;
    }
    resolveSlugFromInput(value, options) {
        const normalized = this.parseString(value)?.toLowerCase();
        if (!normalized) {
            return undefined;
        }
        const matched = options.find((option) => (option.slug.toLowerCase() === normalized ||
            option.name.toLowerCase() === normalized));
        return matched?.slug;
    }
    formatCurrency(amount) {
        return `R${new Intl.NumberFormat('en-ZA').format(amount)}`;
    }
}
exports.CatalogFacade = CatalogFacade;
exports.catalogFacade = new CatalogFacade();
