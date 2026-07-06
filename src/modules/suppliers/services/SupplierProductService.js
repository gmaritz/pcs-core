"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierProductService = exports.SupplierProductService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
// ==========================================================
// Supplier Product Service
// ==========================================================
class SupplierProductService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    /**
     * Retrieve a single supplier product by its unique identifier.
     */
    async getSupplierProduct(id) {
        return this.db.supplierProduct.findUnique({
            where: { id },
        });
    }
    /**
   * Retrieve supplier products.
   *
   * Supports filtering, pagination, sorting,
   * includes and field selection through Prisma.
   */
    async getSupplierProducts(options) {
        return this.db.supplierProduct.findMany(options);
    }
    // ========================================================
    // Commands
    // ========================================================
    /**
     * Create a new supplier product.
     */
    async createSupplierProduct(dto) {
        const data = {
            supplierSku: dto.supplierSku,
            supplierProductName: dto.supplierProductName,
            supplierPrice: dto.supplierPrice,
            currency: dto.currency ?? 'ZAR',
            active: dto.active ?? true,
            supplier: {
                connect: {
                    id: dto.supplierId,
                },
            },
            productVariant: {
                connect: {
                    id: dto.productVariantId,
                },
            },
        };
        return this.db.supplierProduct.create({
            data,
        });
    }
    /**
     * Update an existing supplier product.
     */
    async updateSupplierProduct(id, dto) {
        const data = {};
        if (dto.supplierSku !== undefined) {
            data.supplierSku = dto.supplierSku;
        }
        if (dto.supplierProductName !== undefined) {
            data.supplierProductName = dto.supplierProductName;
        }
        if (dto.supplierPrice !== undefined) {
            data.supplierPrice = dto.supplierPrice;
        }
        if (dto.currency !== undefined) {
            data.currency = dto.currency;
        }
        if (dto.active !== undefined) {
            data.active = dto.active;
        }
        if (dto.supplierId !== undefined) {
            data.supplier = {
                connect: {
                    id: dto.supplierId,
                },
            };
        }
        if (dto.productVariantId !== undefined) {
            data.productVariant = {
                connect: {
                    id: dto.productVariantId,
                },
            };
        }
        return this.db.supplierProduct.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete a supplier product.
     */
    async deleteSupplierProduct(id) {
        return this.db.supplierProduct.delete({
            where: { id },
        });
    }
}
exports.SupplierProductService = SupplierProductService;
// ==========================================================
// Service Instance
// ==========================================================
exports.supplierProductService = new SupplierProductService();
