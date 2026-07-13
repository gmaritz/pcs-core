"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceSyncService = exports.PriceSyncService = exports.PriceSyncServiceError = void 0;
const client_1 = require("@prisma/client");
const pricing_1 = require("../../../pricing");
const BaseService_1 = require("../../../shared/services/BaseService");
// ==========================================================
// Errors
// ==========================================================
class PriceSyncServiceError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'PriceSyncServiceError';
        this.statusCode = statusCode;
    }
}
exports.PriceSyncServiceError = PriceSyncServiceError;
// ==========================================================
// Price Sync Service
// ==========================================================
class PriceSyncService extends BaseService_1.BaseService {
    async synchronise(dto) {
        return this.db.$transaction(async (tx) => {
            const supplier = await tx.supplier.findUnique({
                where: {
                    id: dto.supplierId,
                },
            });
            if (!supplier) {
                throw new PriceSyncServiceError('Supplier not found.', 404);
            }
            const summary = {
                processed: dto.products.length,
                updated: 0,
                manualOverrides: 0,
                errors: [],
            };
            if (dto.products.length === 0) {
                return summary;
            }
            const supplierSkus = Array.from(new Set(dto.products.map((product) => product.supplierSku.trim())));
            const supplierProducts = await tx.supplierProduct.findMany({
                where: {
                    supplierId: dto.supplierId,
                    OR: supplierSkus.map((supplierSku) => ({
                        supplierSku: {
                            equals: supplierSku,
                            mode: 'insensitive',
                        },
                    })),
                },
                select: {
                    supplierSku: true,
                    productVariantId: true,
                },
            });
            const supplierProductBySku = new Map(supplierProducts.map((supplierProduct) => [
                normalizeSku(supplierProduct.supplierSku),
                {
                    supplierSku: supplierProduct.supplierSku,
                    productVariantId: supplierProduct.productVariantId,
                },
            ]));
            if (supplierProductBySku.size !== supplierSkus.length) {
                const missingSku = supplierSkus.find((sku) => !supplierProductBySku.has(sku));
                throw new PriceSyncServiceError(`Supplier product not found for SKU "${missingSku}".`, 404);
            }
            const productVariants = await tx.productVariant.findMany({
                where: {
                    id: {
                        in: supplierProducts.map((supplierProduct) => supplierProduct.productVariantId),
                    },
                },
                select: {
                    id: true,
                    supplierCost: true,
                    markupPercentage: true,
                    sellingPrice: true,
                    manualPriceOverride: true,
                },
            });
            const productVariantById = new Map(productVariants.map((productVariant) => [
                productVariant.id,
                productVariant,
            ]));
            for (const product of dto.products) {
                const normalizedSku = normalizeSku(product.supplierSku);
                const supplierProduct = supplierProductBySku.get(normalizedSku);
                if (!supplierProduct) {
                    throw new PriceSyncServiceError(`Supplier product not found for SKU "${product.supplierSku}".`, 404);
                }
                const productVariant = productVariantById.get(supplierProduct.productVariantId);
                if (!productVariant) {
                    throw new PriceSyncServiceError(`Product variant not found for SKU "${product.supplierSku}".`, 404);
                }
                const updateData = {};
                const roundedSupplierCost = roundToMoney(product.supplierCost);
                const nextSupplierCost = new client_1.Prisma.Decimal(roundedSupplierCost);
                if (!isSameMoney(productVariant.supplierCost, nextSupplierCost)) {
                    updateData.supplierCost = nextSupplierCost;
                }
                if (productVariant.manualPriceOverride) {
                    summary.manualOverrides += 1;
                    if (Object.keys(updateData).length > 0) {
                        await tx.productVariant.update({
                            where: {
                                id: productVariant.id,
                            },
                            data: updateData,
                        });
                        summary.updated += 1;
                    }
                    continue;
                }
                const calculatedPricing = pricing_1.pricingService.calculateFromSupplierCost({
                    supplierCost: roundedSupplierCost,
                    markupPercentage: Number(productVariant.markupPercentage),
                });
                const nextSellingPrice = new client_1.Prisma.Decimal(calculatedPricing.sellingPrice);
                if (!isSameMoney(productVariant.sellingPrice, nextSellingPrice)) {
                    updateData.sellingPrice = nextSellingPrice;
                }
                if (Object.keys(updateData).length === 0) {
                    continue;
                }
                const updatedProductVariant = await tx.productVariant.update({
                    where: {
                        id: productVariant.id,
                    },
                    data: updateData,
                    select: {
                        id: true,
                        supplierCost: true,
                        markupPercentage: true,
                        sellingPrice: true,
                        manualPriceOverride: true,
                    },
                });
                productVariantById.set(productVariant.id, updatedProductVariant);
                summary.updated += 1;
                if (dto.forceRollback && summary.updated === 1) {
                    throw new PriceSyncServiceError('Forced WF-008 rollback verification failure.', 500);
                }
            }
            return summary;
        });
    }
}
exports.PriceSyncService = PriceSyncService;
function normalizeSku(value) {
    return value.trim().toUpperCase();
}
function roundToMoney(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
function isSameMoney(left, right) {
    if (left === null || right === null) {
        return left === right;
    }
    return left.toFixed(2) === right.toFixed(2);
}
exports.priceSyncService = new PriceSyncService();
