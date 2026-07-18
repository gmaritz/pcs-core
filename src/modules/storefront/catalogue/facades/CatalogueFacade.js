"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogueFacade = exports.CatalogueFacade = void 0;
const client_1 = require("@prisma/client");
const services_1 = require("../../../catalog/services");
const content_1 = require("../../../content");
const media_1 = require("../../../media");
const services_2 = require("../../../workflows/product-search/services");
const CataloguePresentationService_1 = require("../services/presentation/CataloguePresentationService");
const LANDING_PRODUCTS_LIMIT = 8;
const SPORT_PRODUCTS_LIMIT = 8;
const BRAND_PRODUCTS_LIMIT = 12;
const CATEGORY_PAGE_SIZE = 12;
const FEATURED_BRAND_LIMIT = 7;
const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured', searchSort: 'relevance' },
    { value: 'newest', label: 'Newest', searchSort: 'newest' },
    { value: 'price-asc', label: 'Price Low to High', searchSort: 'price-asc' },
    { value: 'price-desc', label: 'Price High to Low', searchSort: 'price-desc' },
    { value: 'brand', label: 'Brand', searchSort: 'name-asc' },
    { value: 'alphabetical', label: 'Alphabetical', searchSort: 'name-asc' },
];
class CatalogueFacade {
    async getLanding() {
        const [sports, categories, brands, featuredProducts] = await Promise.all([
            this.loadSports(),
            this.loadCategories(),
            this.loadBrands(),
            this.searchProducts({
                page: 1,
                pageSize: LANDING_PRODUCTS_LIMIT,
                sort: 'relevance',
            }),
        ]);
        const landing = {
            hero: {
                eyebrow: 'Catalogue',
                title: 'Shop Premium Court Sports Equipment',
                description: 'Discover specialist performance gear for Tennis, Padel, and Squash from globally trusted brands.',
                imageUrl: '/images/hero/HeroImage.png',
                imageAlt: 'Premium court sports equipment display',
            },
            featuredSports: sports.slice(0, 3).map((sport) => {
                const media = media_1.mediaService.resolveSportImage(sport.name, sport.slug);
                return {
                    id: sport.id,
                    title: sport.name,
                    description: sport.description?.trim() || `Shop ${sport.name} specialist collections.`,
                    imageUrl: media.url,
                    imageAlt: media.altText,
                    url: `/shop/${sport.slug}`,
                };
            }),
            featuredCategories: categories.slice(0, 6).map((category) => {
                const media = media_1.mediaService.resolveCategoryImage(category.name, category.slug);
                return {
                    id: category.id,
                    title: category.name,
                    description: `Explore premium ${category.name.toLowerCase()} options.`,
                    imageUrl: media.url,
                    imageAlt: media.altText,
                    url: `/shop/${sports.find((sport) => sport.id === category.sportId)?.slug ?? ''}/${category.slug}`,
                };
            }),
            featuredBrands: brands.slice(0, FEATURED_BRAND_LIMIT).map((brand) => {
                const logo = media_1.mediaService.resolveBrandLogo(brand.name, brand.slug, brand.logoUrl);
                return {
                    id: brand.id,
                    name: brand.name,
                    logoUrl: logo.url,
                    url: `/brands/${brand.slug}`,
                };
            }),
            featuredProducts,
        };
        const metadata = content_1.pageMetadataService.buildCatalogPageMetadata();
        return {
            pageTitle: metadata.title,
            heading: landing.hero.title,
            description: landing.hero.description,
            view: 'catalogue/landing',
            metadata,
            breadcrumbs: this.homeShopBreadcrumbs(),
            landing,
        };
    }
    async getSport(sportSlug) {
        const [sports, brands, categories] = await Promise.all([
            this.loadSports(),
            this.loadBrands(),
            this.loadCategories(),
        ]);
        const sport = sports.find((item) => item.slug === sportSlug);
        if (!sport) {
            return null;
        }
        const [featuredProducts, featuredBrands, sportCategories] = await Promise.all([
            this.searchProducts({
                page: 1,
                pageSize: SPORT_PRODUCTS_LIMIT,
                sort: 'relevance',
                sport: sport.name,
            }),
            Promise.resolve(brands
                .filter((brand) => brand.sportId === sport.id)
                .slice(0, FEATURED_BRAND_LIMIT)
                .map((brand) => {
                const logo = media_1.mediaService.resolveBrandLogo(brand.name, brand.slug, brand.logoUrl);
                return {
                    id: brand.id,
                    name: brand.name,
                    logoUrl: logo.url,
                    url: `/brands/${brand.slug}`,
                };
            })),
            Promise.resolve(categories
                .filter((category) => category.sportId === sport.id)
                .map((category) => {
                const media = media_1.mediaService.resolveCategoryImage(category.name, category.slug);
                return {
                    id: category.id,
                    title: category.name,
                    description: `Browse specialist ${category.name.toLowerCase()}.`,
                    imageUrl: media.url,
                    imageAlt: media.altText,
                    url: `/shop/${sport.slug}/${category.slug}`,
                };
            })),
        ]);
        const sportImage = media_1.mediaService.resolveSportImage(sport.name, sport.slug);
        const sportViewModel = {
            slug: sport.slug,
            hero: {
                eyebrow: 'Sport Catalogue',
                title: `${sport.name} Catalogue`,
                description: sport.description?.trim() || `Shop premium ${sport.name.toLowerCase()} equipment and accessories.`,
                imageUrl: sportImage.url,
                imageAlt: sportImage.altText,
            },
            breadcrumbs: CataloguePresentationService_1.cataloguePresentationService.buildBreadcrumbs([
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: sport.name, href: `/shop/${sport.slug}` },
            ]),
            categories: sportCategories,
            featuredBrands,
            featuredProducts,
        };
        const metadata = content_1.pageMetadataService.buildCatalogPageMetadata();
        return {
            pageTitle: `${sport.name} | Pro Court Sports`,
            heading: sportViewModel.hero.title,
            description: sportViewModel.hero.description,
            view: 'catalogue/sport',
            metadata: {
                ...metadata,
                title: `${sport.name} | Pro Court Sports`,
                canonicalUrl: `/shop/${sport.slug}`,
            },
            breadcrumbs: sportViewModel.breadcrumbs,
            sport: sportViewModel,
        };
    }
    async getCategory(sportSlug, categorySlug, query) {
        const [sports, brands, categories] = await Promise.all([
            this.loadSports(),
            this.loadBrands(),
            this.loadCategories(),
        ]);
        const sport = sports.find((item) => item.slug === sportSlug);
        const category = categories.find((item) => item.slug === categorySlug);
        if (!sport || !category || category.sportId !== sport.id) {
            return null;
        }
        const parsed = this.parseQuery(query, CATEGORY_PAGE_SIZE);
        const searchResponse = await services_2.productSearchWorkflowService.search({
            q: parsed.q,
            sport: sport.name,
            category: category.name,
            brand: parsed.brandSlug
                ? brands.find((brand) => brand.slug === parsed.brandSlug)?.name
                : undefined,
            minPrice: parsed.minPrice,
            maxPrice: parsed.maxPrice,
            available: parsed.available,
            page: parsed.page,
            pageSize: parsed.pageSize,
            sort: parsed.sort,
        });
        const mediaMap = await media_1.mediaService.resolveProductImages(Array.from(new Set(searchResponse.results.map((item) => item.productId))));
        const products = CataloguePresentationService_1.cataloguePresentationService.buildProductCards(searchResponse.results, mediaMap);
        const totalPages = Math.max(1, Math.ceil(searchResponse.total / parsed.pageSize));
        const filters = CataloguePresentationService_1.cataloguePresentationService.buildFilterSidebar({
            actionUrl: `/shop/${sport.slug}/${category.slug}`,
            search: parsed.q ?? '',
            sportOptions: CataloguePresentationService_1.cataloguePresentationService.buildFilterOptions(sports, sport.slug),
            categoryOptions: CataloguePresentationService_1.cataloguePresentationService.buildFilterOptions(categories.filter((item) => item.sportId === sport.id), category.slug),
            brandOptions: CataloguePresentationService_1.cataloguePresentationService.buildFilterOptions(brands, parsed.brandSlug),
            selectedAvailability: parsed.availableInput,
            selectedTier: parsed.performanceTier,
            minPrice: parsed.minPrice,
            maxPrice: parsed.maxPrice,
        });
        const sortToolbar = CataloguePresentationService_1.cataloguePresentationService.buildSortToolbar({
            actionUrl: `/shop/${sport.slug}/${category.slug}`,
            resultCount: searchResponse.total,
            selectedSort: parsed.sortInput,
            sortOptions: SORT_OPTIONS.map((item) => ({ value: item.value, label: item.label })),
        });
        const pagination = CataloguePresentationService_1.cataloguePresentationService.buildPagination({
            totalResults: searchResponse.total,
            currentPage: parsed.page,
            totalPages,
            buildUrl: (page) => this.buildCategoryUrl(sport.slug, category.slug, {
                q: parsed.q,
                brand: parsed.brandSlug,
                minPrice: parsed.minPrice,
                maxPrice: parsed.maxPrice,
                available: parsed.availableInput,
                tier: parsed.performanceTier,
                sort: parsed.sortInput,
                page,
            }),
        });
        const categoryImage = media_1.mediaService.resolveCategoryImage(category.name, category.slug);
        const categoryViewModel = {
            sportSlug: sport.slug,
            categorySlug: category.slug,
            hero: {
                eyebrow: 'Category',
                title: `${sport.name} ${category.name}`,
                description: `Explore premium ${category.name.toLowerCase()} options curated for ${sport.name.toLowerCase()} players.`,
                imageUrl: categoryImage.url,
                imageAlt: categoryImage.altText,
            },
            breadcrumbs: CataloguePresentationService_1.cataloguePresentationService.buildBreadcrumbs([
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: sport.name, href: `/shop/${sport.slug}` },
                { label: category.name, href: `/shop/${sport.slug}/${category.slug}` },
            ]),
            filters,
            sortToolbar,
            products,
            pagination,
            resultSummary: this.buildResultSummary(searchResponse.total, parsed.page, parsed.pageSize),
            emptyStateMessage: 'No products matched your selected filters.',
        };
        const metadata = content_1.pageMetadataService.buildCatalogPageMetadata();
        return {
            pageTitle: `${category.name} | ${sport.name} | Pro Court Sports`,
            heading: categoryViewModel.hero.title,
            description: categoryViewModel.hero.description,
            view: 'catalogue/category',
            metadata: {
                ...metadata,
                title: `${category.name} | ${sport.name} | Pro Court Sports`,
                canonicalUrl: `/shop/${sport.slug}/${category.slug}`,
            },
            breadcrumbs: categoryViewModel.breadcrumbs,
            category: categoryViewModel,
        };
    }
    async getBrand(brandSlug, query) {
        const [sports, brands, categories] = await Promise.all([
            this.loadSports(),
            this.loadBrands(),
            this.loadCategories(),
        ]);
        const brand = brands.find((item) => item.slug === brandSlug);
        if (!brand) {
            return null;
        }
        const parsed = this.parseQuery(query, BRAND_PRODUCTS_LIMIT);
        const searchResponse = await services_2.productSearchWorkflowService.search({
            q: parsed.q,
            brand: brand.name,
            minPrice: parsed.minPrice,
            maxPrice: parsed.maxPrice,
            available: parsed.available,
            page: parsed.page,
            pageSize: parsed.pageSize,
            sort: parsed.sort,
        });
        const mediaMap = await media_1.mediaService.resolveProductImages(Array.from(new Set(searchResponse.results.map((item) => item.productId))));
        const products = CataloguePresentationService_1.cataloguePresentationService.buildProductCards(searchResponse.results, mediaMap);
        const totalPages = Math.max(1, Math.ceil(searchResponse.total / parsed.pageSize));
        const pagination = CataloguePresentationService_1.cataloguePresentationService.buildPagination({
            totalResults: searchResponse.total,
            currentPage: parsed.page,
            totalPages,
            buildUrl: (page) => this.buildBrandUrl(brand.slug, {
                q: parsed.q,
                minPrice: parsed.minPrice,
                maxPrice: parsed.maxPrice,
                available: parsed.availableInput,
                sort: parsed.sortInput,
                page,
            }),
        });
        const sortToolbar = CataloguePresentationService_1.cataloguePresentationService.buildSortToolbar({
            actionUrl: `/brands/${brand.slug}`,
            resultCount: searchResponse.total,
            selectedSort: parsed.sortInput,
            sortOptions: SORT_OPTIONS.map((item) => ({ value: item.value, label: item.label })),
        });
        const brandCategories = await services_1.categoryService.getCategories({
            where: {
                status: client_1.RecordStatus.ACTIVE,
                products: {
                    some: {
                        status: client_1.RecordStatus.ACTIVE,
                        brandId: brand.id,
                    },
                },
            },
            orderBy: [
                { displayOrder: 'asc' },
                { name: 'asc' },
            ],
            select: {
                id: true,
                name: true,
                slug: true,
                sportId: true,
            },
        });
        const featuredCategories = brandCategories.slice(0, 6).map((category) => {
            const media = media_1.mediaService.resolveCategoryImage(category.name, category.slug);
            const sportSlug = sports.find((sport) => sport.id === category.sportId)?.slug;
            return {
                id: category.id,
                title: category.name,
                description: `Shop ${category.name.toLowerCase()} from ${brand.name}.`,
                imageUrl: media.url,
                imageAlt: media.altText,
                url: sportSlug
                    ? `/shop/${sportSlug}/${category.slug}`
                    : '/shop',
            };
        });
        const heroLogo = media_1.mediaService.resolveBrandLogo(brand.name, brand.slug, brand.logoUrl);
        const brandViewModel = {
            slug: brand.slug,
            hero: {
                eyebrow: 'Brand',
                title: `${brand.name} Collection`,
                description: `Official ${brand.name} performance equipment curated for specialist court sports players.`,
                imageUrl: heroLogo.url,
                imageAlt: heroLogo.altText,
            },
            breadcrumbs: CataloguePresentationService_1.cataloguePresentationService.buildBreadcrumbs([
                { label: 'Home', href: '/' },
                { label: 'Brands', href: '/brands' },
                { label: brand.name, href: `/brands/${brand.slug}` },
            ]),
            description: brand.description?.trim() || `Explore premium ${brand.name} products for competitive players.`,
            featuredCategories,
            products,
            sortToolbar,
            pagination,
            resultSummary: this.buildResultSummary(searchResponse.total, parsed.page, parsed.pageSize),
        };
        const metadata = content_1.pageMetadataService.buildCatalogPageMetadata();
        return {
            pageTitle: `${brand.name} | Pro Court Sports`,
            heading: brandViewModel.hero.title,
            description: brandViewModel.hero.description,
            view: 'catalogue/brand',
            metadata: {
                ...metadata,
                title: `${brand.name} | Pro Court Sports`,
                canonicalUrl: `/brands/${brand.slug}`,
            },
            breadcrumbs: brandViewModel.breadcrumbs,
            brand: brandViewModel,
        };
    }
    async loadSports() {
        return services_1.sportService.getSports({
            where: {
                status: client_1.RecordStatus.ACTIVE,
            },
            orderBy: [
                { displayOrder: 'asc' },
                { name: 'asc' },
            ],
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
            },
        });
    }
    async loadCategories() {
        return services_1.categoryService.getCategories({
            where: {
                status: client_1.RecordStatus.ACTIVE,
            },
            orderBy: [
                { displayOrder: 'asc' },
                { name: 'asc' },
            ],
            select: {
                id: true,
                name: true,
                slug: true,
                sportId: true,
            },
        });
    }
    async loadBrands() {
        return services_1.brandService.getBrands({
            where: {
                status: client_1.RecordStatus.ACTIVE,
            },
            orderBy: [
                { displayOrder: 'asc' },
                { name: 'asc' },
            ],
            select: {
                id: true,
                name: true,
                slug: true,
                sportId: true,
                logoUrl: true,
                description: true,
            },
        });
    }
    async searchProducts(input) {
        const searchResponse = await services_2.productSearchWorkflowService.search(input);
        const mediaMap = await media_1.mediaService.resolveProductImages(Array.from(new Set(searchResponse.results.map((item) => item.productId))));
        return CataloguePresentationService_1.cataloguePresentationService.buildProductCards(searchResponse.results, mediaMap);
    }
    parseQuery(query, defaultPageSize) {
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
        const sortInput = this.parseString(query.sort) ?? 'featured';
        const sort = SORT_OPTIONS.find((option) => option.value === sortInput)?.searchSort ?? 'relevance';
        return {
            q: this.parseString(query.q),
            brandSlug: this.parseString(query.brand),
            minPrice: normalizedRange.minPrice,
            maxPrice: normalizedRange.maxPrice,
            available: this.parseAvailableBoolean(query.available),
            availableInput: this.parseAvailabilityInput(query.available),
            performanceTier: this.parsePerformanceTierInput(query.performanceTier),
            sortInput,
            sort,
            page: this.parsePositiveInteger(query.page) ?? 1,
            pageSize: this.parsePositiveInteger(query.pageSize) ?? defaultPageSize,
        };
    }
    buildCategoryUrl(sportSlug, categorySlug, query) {
        return this.buildUrl(`/shop/${sportSlug}/${categorySlug}`, query);
    }
    buildBrandUrl(brandSlug, query) {
        return this.buildUrl(`/brands/${brandSlug}`, query);
    }
    buildUrl(basePath, query) {
        const params = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
            if (value === undefined || value === '' || value === 'all') {
                return;
            }
            if (key === 'page' && Number(value) <= 1) {
                return;
            }
            params.set(key, value.toString());
        });
        const encoded = params.toString();
        return encoded
            ? `${basePath}?${encoded}`
            : basePath;
    }
    parseString(value) {
        if (typeof value !== 'string') {
            return undefined;
        }
        const trimmed = value.trim();
        return trimmed.length > 0
            ? trimmed
            : undefined;
    }
    parsePositiveInteger(value) {
        const parsed = Number(value);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            return undefined;
        }
        return parsed;
    }
    parsePositiveNumber(value) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed) || parsed < 0) {
            return undefined;
        }
        return parsed;
    }
    parseAvailableBoolean(value) {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return undefined;
    }
    parseAvailabilityInput(value) {
        if (value === 'true' || value === 'false') {
            return value;
        }
        return 'all';
    }
    parsePerformanceTierInput(value) {
        if (value === 'performance' ||
            value === 'competition' ||
            value === 'elite') {
            return value;
        }
        return 'all';
    }
    buildResultSummary(total, page, pageSize) {
        if (total <= 0) {
            return 'No results found';
        }
        const from = ((page - 1) * pageSize) + 1;
        const to = Math.min(page * pageSize, total);
        return `Showing ${from} - ${to} of ${total} results`;
    }
    homeShopBreadcrumbs() {
        return [
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
        ];
    }
}
exports.CatalogueFacade = CatalogueFacade;
exports.catalogueFacade = new CatalogueFacade();
