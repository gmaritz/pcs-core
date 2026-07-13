"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventorySyncService = exports.InventorySyncService = exports.InventorySyncServiceError = void 0;
const client_1 = require("@prisma/client");
const BaseService_1 = require("../../../shared/services/BaseService");
// ==========================================================
// Errors
// ==========================================================
class InventorySyncServiceError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'InventorySyncServiceError';
        this.statusCode = statusCode;
    }
}
exports.InventorySyncServiceError = InventorySyncServiceError;
// ==========================================================
// Inventory Sync Service
// ==========================================================
class InventorySyncService extends BaseService_1.BaseService {
    async synchronise(dto) {
        return this.db.$transaction(async (tx) => {
            const supplier = await tx.supplier.findUnique({
                where: {
                    id: dto.supplierId,
                },
            });
            if (!supplier) {
                throw new InventorySyncServiceError('Supplier not found.', 404);
            }
            const summary = {
                processed: dto.products.length,
                updated: 0,
                unchanged: 0,
                missing: 0,
                errors: [],
            };
            if (dto.products.length === 0) {
                return summary;
            }
            const supplierSkus = Array.from(new Set(dto.products.map((product) => normalizeSku(product.supplierSku))));
            const supplierProducts = await tx.supplierProduct.findMany({
                where: {
                    supplierId: dto.supplierId,
                    supplierSku: {
                        in: supplierSkus,
                    },
                },
            });
            const supplierProductBySku = new Map(supplierProducts.map((supplierProduct) => [
                normalizeSku(supplierProduct.supplierSku),
                {
                    id: supplierProduct.id,
                    supplierSku: supplierProduct.supplierSku,
                    productVariantId: supplierProduct.productVariantId,
                },
            ]));
            if (supplierProductBySku.size !== supplierSkus.length) {
                const missingSku = supplierSkus.find((sku) => !supplierProductBySku.has(sku));
                throw new InventorySyncServiceError(`Supplier product not found for SKU "${missingSku}".`, 404);
            }
            const inventories = await tx.inventory.findMany({
                where: {
                    productVariantId: {
                        in: supplierProducts.map((supplierProduct) => supplierProduct.productVariantId),
                    },
                },
            });
            const inventoryByVariantId = new Map(inventories.map((inventory) => [
                inventory.productVariantId,
                inventory,
            ]));
            for (const product of dto.products) {
                const normalizedSku = normalizeSku(product.supplierSku);
                const supplierProduct = supplierProductBySku.get(normalizedSku);
                if (!supplierProduct) {
                    throw new InventorySyncServiceError(`Supplier product not found for SKU "${product.supplierSku}".`, 404);
                }
                const inventory = inventoryByVariantId.get(supplierProduct.productVariantId);
                if (!inventory) {
                    throw new InventorySyncServiceError(`Inventory not found for SKU "${product.supplierSku}".`, 404);
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
                inventoryByVariantId.set(supplierProduct.productVariantId, updatedInventory);
                await tx.inventoryMovement.create({
                    data: {
                        inventoryId: inventory.id,
                        movementType: client_1.InventoryMovementType.SYNC,
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
                    throw new InventorySyncServiceError('Forced WF-007 rollback verification failure.', 500);
                }
            }
            return summary;
        });
    }
}
exports.InventorySyncService = InventorySyncService;
function normalizeSku(value) {
    return value.trim().toUpperCase();
}
exports.inventorySyncService = new InventorySyncService();
