// ==========================================================
// Imports
// ==========================================================

import {
  Inventory,
  InventoryMovement,
  InventoryMovementType,
  Prisma,
} from '@prisma/client';

import { BaseService } from '../../../shared/services/BaseService';

import {
  SynchroniseInventoryDto,
  SynchroniseInventorySummary,
} from '../types';

// ==========================================================
// Errors
// ==========================================================

export class InventorySyncServiceError extends Error {

  readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
  ) {

    super(message);

    this.name = 'InventorySyncServiceError';

    this.statusCode = statusCode;

  }

}

interface SupplierProductMatch {
  id: string;
  supplierSku: string;
  productVariantId: string;
}

// ==========================================================
// Inventory Sync Service
// ==========================================================

export class InventorySyncService extends BaseService {

  async synchronise(
    dto: SynchroniseInventoryDto,
  ): Promise<SynchroniseInventorySummary> {

    return this.db.$transaction(async (tx) => {

      const supplier = await tx.supplier.findUnique({

        where: {
          id: dto.supplierId,
        },

      });

      if (!supplier) {
        throw new InventorySyncServiceError('Supplier not found.', 404);
      }

      const summary: SynchroniseInventorySummary = {
        processed: dto.products.length,
        updated: 0,
        unchanged: 0,
        missing: 0,
        errors: [],
      };

      if (dto.products.length === 0) {
        return summary;
      }

      const supplierSkus = Array.from(new Set(
        dto.products.map((product) => normalizeSku(product.supplierSku)),
      ));

      const supplierProducts = await tx.supplierProduct.findMany({
        where: {
          supplierId: dto.supplierId,
          supplierSku: {
            in: supplierSkus,
          },
        },
      });

      const supplierProductBySku = new Map<string, SupplierProductMatch>(
        supplierProducts.map((supplierProduct) => [
          normalizeSku(supplierProduct.supplierSku),
          {
            id: supplierProduct.id,
            supplierSku: supplierProduct.supplierSku,
            productVariantId: supplierProduct.productVariantId,
          },
        ]),
      );

      if (supplierProductBySku.size !== supplierSkus.length) {

        const missingSku = supplierSkus.find((sku) => !supplierProductBySku.has(sku));

        throw new InventorySyncServiceError(
          `Supplier product not found for SKU "${missingSku}".`,
          404,
        );

      }

      const inventories = await tx.inventory.findMany({
        where: {
          productVariantId: {
            in: supplierProducts.map((supplierProduct) => supplierProduct.productVariantId),
          },
        },
      });

      const inventoryByVariantId = new Map<string, Inventory>(
        inventories.map((inventory) => [
          inventory.productVariantId,
          inventory,
        ]),
      );

      for (const product of dto.products) {

        const normalizedSku = normalizeSku(product.supplierSku);
        const supplierProduct = supplierProductBySku.get(normalizedSku);

        if (!supplierProduct) {
          throw new InventorySyncServiceError(
            `Supplier product not found for SKU "${product.supplierSku}".`,
            404,
          );
        }

        const inventory = inventoryByVariantId.get(supplierProduct.productVariantId);

        if (!inventory) {
          throw new InventorySyncServiceError(
            `Inventory not found for SKU "${product.supplierSku}".`,
            404,
          );
        }

        if (inventory.quantityOnHand === product.quantity) {
          summary.unchanged += 1;
          continue;
        }

        const difference = product.quantity - inventory.quantityOnHand;

        const updatedInventory = await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            quantityOnHand: product.quantity,
          },
        });

        inventoryByVariantId.set(
          supplierProduct.productVariantId,
          updatedInventory,
        );

        await tx.inventoryMovement.create({
          data: {
            inventoryId: inventory.id,
            movementType: InventoryMovementType.SYNC,
            quantity: difference,
            reason: 'SYNC',
            reference: JSON.stringify({
              supplierId: dto.supplierId,
              supplierSku: product.supplierSku,
              oldQuantity: inventory.quantityOnHand,
              newQuantity: product.quantity,
              difference,
            }),
          },
        });

        summary.updated += 1;

        if (dto.forceRollback && summary.updated === 1) {
          throw new InventorySyncServiceError(
            'Forced WF-007 rollback verification failure.',
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

export const inventorySyncService =
  new InventorySyncService();
