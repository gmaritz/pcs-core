"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storefrontFacade = exports.StorefrontFacade = void 0;
const client_1 = require("@prisma/client");
const services_1 = require("../../catalog/services");
const media_1 = require("../../media");
const services_2 = require("../services");
const SEARCH_ACTION_URL = '/api/v1/products/search';
const ANNOUNCEMENT_MESSAGE = "South Africa's Court Sports Specialists";
const FEATURED_PRODUCTS_LIMIT = 8;
const FEATURED_CATEGORIES_LIMIT = 6;
const FEATURED_SPORTS_LIMIT = 3;
const FEATURED_BRANDS_LIMIT = 7;
const FEATURED_SPORT_SLUGS = ['tennis', 'padel', 'squash'];
const FEATURED_CATEGORY_PRIORITY = [
    'racquet',
    'shoe',
    'apparel',
    'bag',
    'string',
    'accessories',
    'accessory',
];
const FEATURED_CATEGORY_FALLBACKS = [
    'Racquets',
    'Shoes',
    'Apparel',
    'Bags',
    'Strings',
    'Accessories',
];
const FEATURED_BRAND_PRIORITY = [
    'wilson',
    'head',
    'babolat',
    'tecnifibre',
    'dunlop',
    'yonex',
    'asics',
];
const HEADER_NAVIGATION = [
    {
        label: 'Shop',
        href: '/shop',
    },
    {
        label: 'Sports',
        href: '/#shop-by-sport',
    },
    {
        label: 'Brands',
        href: '/#featured-brands',
    },
    {
        label: 'New Arrivals',
        href: '/shop?sort=newest',
    },
    {
        label: 'About',
        href: '/about',
    },
    {
        label: 'Contact',
        href: '/contact',
    },
];
const TRUST_CARDS = [
    {
        icon: 'star',
        title: 'Premium Brands',
        description: "Official performance equipment from the world's leading manufacturers.",
    },
    {
        icon: 'racket',
        title: 'Court Sports Specialists',
        description: 'Focused exclusively on Tennis, Padel and Squash.',
    },
    {
        icon: 'truck',
        title: 'Nationwide Delivery',
        description: 'Fast delivery across South Africa.',
    },
    {
        icon: 'lock',
        title: 'Secure Checkout',
        description: 'Safe encrypted online payments.',
    },
];
class StorefrontFacade {
    async getHomepage() {
        const [heroStatistics, featuredProducts, featuredBrands, featuredCategories, featuredSports,] = await Promise.all([
            this.buildHeroStatistics(),
            this.getFeaturedProducts(),
            this.getFeaturedBrands(),
            this.getFeaturedCategories(),
            this.getFeaturedSports(),
        ]);
        return {
            announcement: {
                message: ANNOUNCEMENT_MESSAGE,
            },
            header: {
                logoUrl: '/images/logo/logo.png',
                logoAlt: 'Pro Court Sports logo',
                navigation: HEADER_NAVIGATION,
                searchUrl: '/search',
                accountUrl: '/account',
                cartUrl: '/cart',
            },
            hero: {
                headline: 'Performance Equipment for Tennis, Padel & Squash',
                supportingText: "Premium racquets, footwear, apparel and accessories from the world's leading court sports brands.",
                primaryCtaLabel: 'Shop Now',
                primaryCtaUrl: '/shop',
                secondaryCtaLabel: 'Browse Sports',
                secondaryCtaUrl: '/#shop-by-sport',
                imageUrl: '/images/hero/HeroImage.png',
                imageAlt: 'Court sports equipment lifestyle banner',
            },
            featuredSports,
            featuredCategories,
            heroStatistics,
            featuredProducts,
            featuredBrands,
            trustCards: TRUST_CARDS,
            newsletter: {
                heading: 'Stay Ahead of the Game',
                subheading: 'Receive product launches, promotions and court sports news.',
                emailPlaceholder: 'Enter your email address',
                buttonLabel: 'Subscribe',
                actionUrl: '#',
            },
            currentYear: new Date().getFullYear(),
            // Backward compatibility.
            brands: featuredBrands,
            categories: featuredCategories,
            sports: featuredSports,
            searchAction: SEARCH_ACTION_URL,
        };
    }
    async buildHomeViewModel() {
        return this.getHomepage();
    }
    async buildHeroStatistics() {
        const [products, brands, sports, categories] = await Promise.all([
            services_1.productService.getProducts({
                where: {
                    status: client_1.RecordStatus.ACTIVE,
                },
                select: {
                    id: true,
                },
            }),
            services_1.brandService.getBrands({
                where: {
                    status: client_1.RecordStatus.ACTIVE,
                },
                select: {
                    id: true,
                },
            }),
            services_1.sportService.getSports({
                where: {
                    status: client_1.RecordStatus.ACTIVE,
                },
                select: {
                    id: true,
                },
            }),
            services_1.categoryService.getCategories({
                where: {
                    status: client_1.RecordStatus.ACTIVE,
                },
                select: {
                    id: true,
                },
            }),
        ]);
        const items = [
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
                formattedValue: services_2.storefrontPresentationService.formatInteger(item.value),
            })),
        };
    }
    async getFeaturedProducts() {
        const products = await services_1.productService.getProducts({
            where: {
                status: client_1.RecordStatus.ACTIVE,
                variants: {
                    some: {
                        status: client_1.RecordStatus.ACTIVE,
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
                        status: client_1.RecordStatus.ACTIVE,
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
        });
        const mediaMap = await media_1.mediaService.resolveProductImages(products.map((product) => product.id));
        return {
            items: products.map((product) => {
                const variant = product.variants[0];
                const media = mediaMap[product.id];
                const availableQuantity = variant.inventory.reduce((sum, inventory) => (sum + (inventory.quantityOnHand - inventory.quantityReserved)), 0);
                const isOutOfStock = availableQuantity <= 0;
                const isLimitedStock = !isOutOfStock && availableQuantity <= 3;
                const stockLabel = isOutOfStock
                    ? 'Out of stock'
                    : isLimitedStock
                        ? 'Limited stock'
                        : 'In stock';
                const stockState = isOutOfStock
                    ? 'out'
                    : isLimitedStock
                        ? 'limited'
                        : 'in';
                return {
                    id: product.id,
                    name: variant.name,
                    description: product.shortDescription ??
                        product.description ??
                        variant.description ??
                        'Premium performance product selected for specialist players.',
                    brandName: product.brand.name,
                    sportName: product.sport.name,
                    imageUrl: media.url,
                    imageAlt: media.altText,
                    formattedPrice: services_2.storefrontPresentationService.formatPrice(Number(variant.sellingPrice)),
                    stockLabel,
                    stockState,
                    availabilityLabel: isOutOfStock ? 'Out of Stock' : 'In Stock',
                    isOutOfStock,
                    url: `/product/${product.slug}`,
                    brandClass: services_2.storefrontPresentationService.resolveBrandThemeClass(product.brand.slug),
                };
            }),
        };
    }
    async getFeaturedBrands() {
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
        });
        const sortedBrands = [...brands].sort((left, right) => {
            const leftPriority = FEATURED_BRAND_PRIORITY.indexOf(left.slug.toLowerCase());
            const rightPriority = FEATURED_BRAND_PRIORITY.indexOf(right.slug.toLowerCase());
            const normalizedLeft = leftPriority >= 0
                ? leftPriority
                : FEATURED_BRAND_PRIORITY.length;
            const normalizedRight = rightPriority >= 0
                ? rightPriority
                : FEATURED_BRAND_PRIORITY.length;
            return normalizedLeft - normalizedRight;
        });
        const selectedBrands = sortedBrands.slice(0, FEATURED_BRANDS_LIMIT);
        const selectedBrandSlugs = new Set(selectedBrands.map((brand) => brand.slug.toLowerCase()));
        FEATURED_BRAND_PRIORITY.forEach((slug) => {
            if (selectedBrands.length >= FEATURED_BRANDS_LIMIT ||
                selectedBrandSlugs.has(slug)) {
                return;
            }
            selectedBrands.push({
                id: `fallback-brand-${slug}`,
                name: slug.charAt(0).toUpperCase() + slug.slice(1),
                code: `fallback-${slug}`,
                slug,
                sportId: '',
                logoUrl: null,
                website: null,
                description: null,
                status: client_1.RecordStatus.ACTIVE,
                displayOrder: 999,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });
        return {
            items: selectedBrands.map((brand) => {
                const logo = media_1.mediaService.resolveBrandLogo(brand.name, brand.slug, brand.logoUrl);
                return {
                    id: brand.id,
                    name: brand.name,
                    logoUrl: logo.url,
                    url: `/shop?brand=${brand.slug}`,
                    themeClass: services_2.storefrontPresentationService.resolveBrandThemeClass(brand.slug),
                };
            }),
        };
    }
    async getFeaturedCategories() {
        const categories = await services_1.categoryService.getCategories({
            where: {
                status: client_1.RecordStatus.ACTIVE,
            },
            include: {
                products: {
                    where: {
                        status: client_1.RecordStatus.ACTIVE,
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
        });
        const sortedCategories = [...categories].sort((left, right) => {
            const leftName = left.name.toLowerCase();
            const rightName = right.name.toLowerCase();
            const leftPriority = FEATURED_CATEGORY_PRIORITY.findIndex((token) => (leftName.includes(token)));
            const rightPriority = FEATURED_CATEGORY_PRIORITY.findIndex((token) => (rightName.includes(token)));
            const normalizedLeft = leftPriority >= 0
                ? leftPriority
                : FEATURED_CATEGORY_PRIORITY.length;
            const normalizedRight = rightPriority >= 0
                ? rightPriority
                : FEATURED_CATEGORY_PRIORITY.length;
            return normalizedLeft - normalizedRight;
        });
        const selectedCategories = sortedCategories.slice(0, FEATURED_CATEGORIES_LIMIT);
        const selectedCategoryNames = new Set(selectedCategories.map((category) => category.name.toLowerCase()));
        FEATURED_CATEGORY_FALLBACKS.forEach((name) => {
            if (selectedCategories.length >= FEATURED_CATEGORIES_LIMIT ||
                selectedCategoryNames.has(name.toLowerCase())) {
                return;
            }
            selectedCategories.push({
                id: `fallback-category-${name.toLowerCase()}`,
                name,
                code: `fallback-${name.toLowerCase()}`,
                slug: name.toLowerCase(),
                sportId: '',
                description: null,
                status: client_1.RecordStatus.ACTIVE,
                displayOrder: 999,
                createdAt: new Date(),
                updatedAt: new Date(),
                products: [],
            });
        });
        return {
            items: selectedCategories.map((category) => {
                const media = media_1.mediaService.resolveCategoryImage(category.name, category.slug);
                return {
                    id: category.id,
                    name: category.name,
                    description: services_2.storefrontPresentationService.resolveCategoryDescription(category.name),
                    imageUrl: media.url,
                    productCount: category.products.length,
                    formattedProductCount: services_2.storefrontPresentationService.formatInteger(category.products.length),
                    url: `/shop?category=${category.slug}`,
                };
            }),
        };
    }
    async getFeaturedSports() {
        const sports = await services_1.sportService.getSports({
            where: {
                status: client_1.RecordStatus.ACTIVE,
                slug: {
                    in: FEATURED_SPORT_SLUGS,
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
        });
        const sportBySlug = new Map(sports.map((sport) => [sport.slug.toLowerCase(), sport]));
        const selectedSports = FEATURED_SPORT_SLUGS.slice(0, FEATURED_SPORTS_LIMIT).map((slug) => {
            const existingSport = sportBySlug.get(slug);
            if (existingSport) {
                return existingSport;
            }
            return {
                id: `fallback-sport-${slug}`,
                name: slug.charAt(0).toUpperCase() + slug.slice(1),
                code: `fallback-${slug}`,
                slug,
                description: null,
                status: client_1.RecordStatus.ACTIVE,
                displayOrder: 999,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        });
        return {
            items: selectedSports.map((sport) => {
                const media = media_1.mediaService.resolveSportImage(sport.name, sport.slug);
                return {
                    id: sport.id,
                    name: sport.name,
                    description: services_2.storefrontPresentationService.resolveSportDescription(sport.name, sport.description),
                    tagline: services_2.storefrontPresentationService.resolveSportTagline(sport.slug),
                    heroImageUrl: media.url,
                    heroImageAlt: media.altText,
                    statusLabel: 'Shop Collection',
                    url: `/shop?sport=${sport.slug}`,
                };
            }),
        };
    }
}
exports.StorefrontFacade = StorefrontFacade;
exports.storefrontFacade = new StorefrontFacade();
