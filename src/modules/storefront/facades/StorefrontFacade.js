"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storefrontFacade = exports.StorefrontFacade = void 0;
const client_1 = require("@prisma/client");
const services_1 = require("../../catalog/services");
const services_2 = require("../services");
const SEARCH_ACTION_URL = '/api/v1/products/search';
const FEATURED_PRODUCTS_LIMIT = 8;
class StorefrontFacade {
    async buildHomeViewModel() {
        const [heroStatistics, featuredProducts, brands, categories, sports,] = await Promise.all([
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
    async buildFeaturedProducts() {
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
        });
        return {
            items: products.map((product) => {
                const variant = product.variants[0];
                const primaryMedia = product.media.find((entry) => (entry.isPrimary ||
                    entry.mediaRole === client_1.MediaRole.PRIMARY ||
                    entry.mediaRole === client_1.MediaRole.HERO));
                const imageUrl = primaryMedia?.media.url ??
                    '/images/products/wilson-clash.jpeg';
                const availableQuantity = variant.inventory.reduce((sum, inventory) => (sum + (inventory.quantityOnHand - inventory.quantityReserved)), 0);
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
                    formattedPrice: services_2.storefrontPresentationService.formatPrice(Number(variant.sellingPrice)),
                    availabilityLabel: isOutOfStock ? 'Out of Stock' : 'In Stock',
                    isOutOfStock,
                    url: `/product/${product.slug}`,
                    brandClass: services_2.storefrontPresentationService.resolveBrandThemeClass(product.brand.slug),
                };
            }),
        };
    }
    async buildBrands() {
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
            take: 10,
        });
        return {
            items: brands.map((brand) => ({
                id: brand.id,
                name: brand.name,
                logoUrl: brand.logoUrl ?? undefined,
                url: `/brands?brand=${brand.slug}`,
                themeClass: services_2.storefrontPresentationService.resolveBrandThemeClass(brand.slug),
            })),
        };
    }
    async buildCategories() {
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
            take: 8,
        });
        return {
            items: categories.map((category) => ({
                id: category.id,
                name: category.name,
                description: services_2.storefrontPresentationService.resolveCategoryDescription(category.name),
                imageUrl: services_2.storefrontPresentationService.resolveCategoryImage(category.slug),
                productCount: category.products.length,
                formattedProductCount: services_2.storefrontPresentationService.formatInteger(category.products.length),
                url: `/category/${category.slug}`,
            })),
        };
    }
    async buildSports() {
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
            take: 6,
        });
        return {
            items: sports.map((sport) => ({
                id: sport.id,
                name: sport.name,
                description: services_2.storefrontPresentationService.resolveSportDescription(sport.name, sport.description),
                tagline: services_2.storefrontPresentationService.resolveSportTagline(sport.slug),
                heroImageUrl: services_2.storefrontPresentationService.resolveSportImage(sport.slug),
                heroImageAlt: `${sport.name} equipment`,
                statusLabel: 'Catalog Launching Soon',
                url: `/sports?sport=${sport.slug}`,
            })),
        };
    }
}
exports.StorefrontFacade = StorefrontFacade;
exports.storefrontFacade = new StorefrontFacade();
