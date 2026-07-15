"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationService = exports.RecommendationService = void 0;
const client_1 = require("@prisma/client");
const services_1 = require("../../catalog/services");
const DEFAULT_RECOMMENDATION_LIMIT = 4;
class RecommendationService {
    async resolveRelatedProducts(criteria) {
        const limit = criteria.limit ?? DEFAULT_RECOMMENDATION_LIMIT;
        const candidates = await services_1.productService.getProducts({
            where: {
                status: client_1.RecordStatus.ACTIVE,
                id: {
                    not: criteria.productId,
                },
                OR: [
                    {
                        categoryId: criteria.categoryId,
                    },
                    {
                        brandId: criteria.brandId,
                    },
                    {
                        sportId: criteria.sportId,
                    },
                ],
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
            },
            orderBy: [
                {
                    displayOrder: 'asc',
                },
                {
                    createdAt: 'desc',
                },
            ],
            take: limit * 4,
        });
        const ranked = candidates
            .map((product) => this.mapRecommendation(product, criteria))
            .filter((item) => Boolean(item))
            .sort((left, right) => {
            if (left.rank !== right.rank) {
                return left.rank - right.rank;
            }
            if (left.isAvailable !== right.isAvailable) {
                return left.isAvailable ? -1 : 1;
            }
            return left.item.productName.localeCompare(right.item.productName);
        })
            .slice(0, limit)
            .map((entry) => entry.item);
        return ranked;
    }
    mapRecommendation(product, criteria) {
        const variant = product.variants[0];
        if (!variant || variant.sellingPrice === null) {
            return undefined;
        }
        const availableQuantity = variant.inventory.reduce((sum, inventory) => (sum + (inventory.quantityOnHand - inventory.quantityReserved)), 0);
        const rank = this.resolveRank(product, criteria);
        if (rank === Number.POSITIVE_INFINITY) {
            return undefined;
        }
        return {
            rank,
            isAvailable: availableQuantity > 0,
            item: {
                productId: product.id,
                productSlug: product.slug,
                productName: product.name,
                brandName: product.brand.name,
                sportName: product.sport.name,
                variantId: variant.id,
                variantSku: variant.sku,
                sellingPrice: Number(variant.sellingPrice),
                isAvailable: availableQuantity > 0,
            },
        };
    }
    resolveRank(product, criteria) {
        if (product.categoryId === criteria.categoryId) {
            return 1;
        }
        if (product.brandId === criteria.brandId) {
            return 2;
        }
        if (product.sportId === criteria.sportId) {
            return 3;
        }
        return Number.POSITIVE_INFINITY;
    }
}
exports.RecommendationService = RecommendationService;
exports.recommendationService = new RecommendationService();
