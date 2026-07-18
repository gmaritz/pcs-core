"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSearchService = exports.ProductSearchService = void 0;
const client_1 = require("@prisma/client");
const BaseService_1 = require("../../shared/services/BaseService");
const engines_1 = require("../engines");
const mappers_1 = require("../mappers");
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
// ==========================================================
// Product Search Service
// ==========================================================
class ProductSearchService extends BaseService_1.BaseService {
    async search(request) {
        const criteria = this.buildCriteria(request);
        const records = await this.loadSearchRecords();
        const result = engines_1.productSearchEngine.search(records, criteria);
        return {
            page: criteria.page,
            pageSize: criteria.pageSize,
            total: result.total,
            results: result.records.map((record) => mappers_1.productSearchMapper.toResultItem(record)),
        };
    }
    buildCriteria(request) {
        return {
            q: normalizeOptional(request.q),
            sport: normalizeOptional(request.sport),
            brand: normalizeOptional(request.brand),
            category: normalizeOptional(request.category),
            minPrice: request.minPrice,
            maxPrice: request.maxPrice,
            available: request.available,
            page: request.page ?? DEFAULT_PAGE,
            pageSize: Math.min(request.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
            sort: request.sort ?? 'relevance',
        };
    }
    async loadSearchRecords() {
        const products = await this.db.product.findMany({
            where: {
                status: client_1.RecordStatus.ACTIVE,
            },
            include: {
                brand: true,
                category: true,
                sport: true,
                variants: {
                    where: {
                        status: client_1.RecordStatus.ACTIVE,
                    },
                    include: {
                        inventory: true,
                    },
                },
            },
        });
        const records = [];
        for (const product of products) {
            const candidateVariants = product.variants
                .filter((variant) => Boolean(variant.sellingPrice))
                .sort((left, right) => {
                if (left.isDefault !== right.isDefault) {
                    return left.isDefault ? -1 : 1;
                }
                const leftPrice = Number(left.sellingPrice);
                const rightPrice = Number(right.sellingPrice);
                if (leftPrice !== rightPrice) {
                    return leftPrice - rightPrice;
                }
                return left.id.localeCompare(right.id);
            });
            const variant = candidateVariants[0];
            if (!variant) {
                continue;
            }
            const availableQuantity = variant.inventory.reduce((total, inventory) => total + (inventory.quantityOnHand -
                inventory.quantityReserved), 0);
            records.push({
                productId: product.id,
                productName: product.name,
                productSlug: product.slug,
                productDescription: [
                    product.shortDescription,
                    product.description,
                    variant.description,
                ].filter((value) => Boolean(value)).join(' '),
                productCreatedAt: product.createdAt,
                brandName: product.brand.name,
                categoryName: product.category.name,
                sportName: product.sport.name,
                variantId: variant.id,
                variantName: variant.name,
                variantSku: variant.sku,
                sellingPrice: Number(variant.sellingPrice),
                available: availableQuantity > 0,
            });
        }
        return records;
    }
}
exports.ProductSearchService = ProductSearchService;
function normalizeOptional(value) {
    if (!value?.trim()) {
        return undefined;
    }
    return value.trim();
}
exports.productSearchService = new ProductSearchService();
