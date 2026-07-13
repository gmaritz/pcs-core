// ==========================================================
// Imports
// ==========================================================

import {
  Prisma,
} from '@prisma/client';

import {
  pricingService,
} from '../../../pricing';
import {
  BaseService,
} from '../../../shared/services/BaseService';

import {
  SynchronisePricingDto,
  SynchronisePricingSummary,
} from '../types';

// ==========================================================
// Errors
// ==========================================================

export class PriceSyncServiceError extends Error {

  readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
  ) {

    super(message);

    this.name = 'PriceSyncServiceError';

    this.statusCode = statusCode;

  }

}

interface SupplierProductMatch {
  supplierSku: string;
  productVariantId: string;
}

interface ProductVariantPricingState {
  id: string;
  supplierCost: Prisma.Decimal | null;
  markupPercentage: Prisma.Decimal;
  sellingPrice: Prisma.Decimal | null;
  manualPriceOverride: boolean;
}

// ==========================================================
// Price Sync Service
// ==========================================================

export class PriceSyncService extends BaseService {

  async synchronise(
    dto: SynchronisePricingDto,
  ): Promise<SynchronisePricingSummary> {

    return this.db.$transaction(async (tx) => {

      const supplier = await tx.supplier.findUnique({

        where: {
          id: dto.supplierId,
        },

      });

      if (!supplier) {
        throw new PriceSyncServiceError('Supplier not found.', 404);
      }

      const summary: SynchronisePricingSummary = {
        processed: dto.products.length,
        updated: 0,
        manualOverrides: 0,
        errors: [],
      };

      if (dto.products.length === 0) {
        return summary;
      }

      const supplierSkus = Array.from(new Set(
        dto.products.map((product) => product.supplierSku.trim()),
      ));

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

      const supplierProductBySku = new Map<string, SupplierProductMatch>(
        supplierProducts.map((supplierProduct) => [
          normalizeSku(supplierProduct.supplierSku),
          {
            supplierSku: supplierProduct.supplierSku,
            productVariantId: supplierProduct.productVariantId,
          },
        ]),
      );

      if (supplierProductBySku.size !== supplierSkus.length) {

        const missingSku = supplierSkus.find((sku) => !supplierProductBySku.has(sku));

        throw new PriceSyncServiceError(
          `Supplier product not found for SKU "${missingSku}".`,
          404,
        );

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

      const productVariantById = new Map<string, ProductVariantPricingState>(
        productVariants.map((productVariant) => [
          productVariant.id,
          productVariant,
        ]),
      );

      for (const product of dto.products) {

        const normalizedSku = normalizeSku(product.supplierSku);

        const supplierProduct = supplierProductBySku.get(normalizedSku);

        if (!supplierProduct) {
          throw new PriceSyncServiceError(
            `Supplier product not found for SKU "${product.supplierSku}".`,
            404,
          );
        }

        const productVariant = productVariantById.get(supplierProduct.productVariantId);

        if (!productVariant) {
          throw new PriceSyncServiceError(
            `Product variant not found for SKU "${product.supplierSku}".`,
            404,
          );
        }

        const updateData: Prisma.ProductVariantUpdateInput = {};

        const roundedSupplierCost = roundToMoney(product.supplierCost);
        const nextSupplierCost = new Prisma.Decimal(roundedSupplierCost);

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

        const calculatedPricing = pricingService.calculateFromSupplierCost({
          supplierCost: roundedSupplierCost,
          markupPercentage: Number(productVariant.markupPercentage),
        });

        const nextSellingPrice = new Prisma.Decimal(calculatedPricing.sellingPrice);

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

        productVariantById.set(
          productVariant.id,
          updatedProductVariant,
        );

        summary.updated += 1;

        if (dto.forceRollback && summary.updated === 1) {
          throw new PriceSyncServiceError(
            'Forced WF-008 rollback verification failure.',
            500,
          );
        }

      }

      return summary;

    });

  }

}

function normalizeSku(
  value: string,
): string {

  return value.trim().toUpperCase();

}

function roundToMoney(
  value: number,
): number {

  return Math.round((value + Number.EPSILON) * 100) / 100;

}

function isSameMoney(
  left: Prisma.Decimal | null,
  right: Prisma.Decimal | null,
): boolean {

  if (left === null || right === null) {
    return left === right;
  }

  return left.toFixed(2) === right.toFixed(2);

}

export const priceSyncService =
  new PriceSyncService();
