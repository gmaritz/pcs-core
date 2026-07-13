"use strict";
// ==========================================================
// Supplier Product Importer
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierProductImporter = void 0;
const client_1 = require("@prisma/client");
function normalizeName(value) {
    return value.trim().toLowerCase();
}
class SupplierProductImporter {
    constructor(tx, supplierId, references) {
        this.tx = tx;
        this.supplierId = supplierId;
        this.references = references;
    }
    async import(products) {
        const summary = {
            processed: products.length,
            createdProducts: 0,
            updatedProducts: 0,
            createdVariants: 0,
            updatedVariants: 0,
            createdInventory: 0,
            updatedInventory: 0,
            skipped: 0,
            errors: [],
        };
        const forceFailureAfterFirstRecord = process.env.WF005_FORCE_EXCEPTION_AFTER_FIRST_RECORD === 'true';
        for (const [index, productInput] of products.entries()) {
            const brand = this.references.brandsByName.get(normalizeName(productInput.brand));
            const category = this.references.categoriesByName.get(normalizeName(productInput.category));
            const sport = this.references.sportsByName.get(normalizeName(productInput.sport));
            if (!brand || !category || !sport) {
                throw new Error('Validation references missing during import.');
            }
            const supplierProduct = await this.tx.supplierProduct.findFirst({
                where: {
                    supplierId: this.supplierId,
                    supplierSku: productInput.supplierSku,
                },
                include: {
                    productVariant: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            let product;
            let variant;
            if (supplierProduct) {
                product = supplierProduct.productVariant.product;
                variant = supplierProduct.productVariant;
                const productUpdated = await this.updateProductIfNeeded(product, productInput, brand.id, category.id, sport.id);
                if (productUpdated) {
                    summary.updatedProducts += 1;
                }
                const variantUpdated = await this.updateVariantIfNeeded(variant, productInput);
                if (variantUpdated) {
                    summary.updatedVariants += 1;
                }
                await this.tx.supplierProduct.update({
                    where: {
                        id: supplierProduct.id,
                    },
                    data: {
                        supplierProductName: productInput.name,
                        supplierPrice: new client_1.Prisma.Decimal(productInput.price),
                        active: true,
                    },
                });
            }
            else {
                const productResult = await this.resolveProduct(productInput, brand.id, category.id, sport.id);
                product = productResult.product;
                if (productResult.created) {
                    summary.createdProducts += 1;
                }
                else {
                    summary.updatedProducts += 1;
                }
                const variantResult = await this.resolveVariant(product.id, productInput);
                variant = variantResult.variant;
                if (variantResult.created) {
                    summary.createdVariants += 1;
                }
                else {
                    summary.updatedVariants += 1;
                }
                await this.tx.supplierProduct.create({
                    data: {
                        supplierId: this.supplierId,
                        supplierSku: productInput.supplierSku,
                        supplierProductName: productInput.name,
                        supplierPrice: new client_1.Prisma.Decimal(productInput.price),
                        active: true,
                        productVariantId: variant.id,
                    },
                });
            }
            const inventory = await this.tx.inventory.findUnique({
                where: {
                    productVariantId: variant.id,
                },
            });
            if (!inventory) {
                await this.tx.inventory.create({
                    data: {
                        productVariantId: variant.id,
                        quantityOnHand: productInput.quantity,
                    },
                });
                summary.createdInventory += 1;
            }
            else {
                await this.tx.inventory.update({
                    where: {
                        id: inventory.id,
                    },
                    data: {
                        quantityOnHand: productInput.quantity,
                    },
                });
                summary.updatedInventory += 1;
            }
            if (forceFailureAfterFirstRecord &&
                index === 0) {
                throw new Error('Forced WF-005 rollback verification failure.');
            }
        }
        return summary;
    }
    async importRecords(records) {
        return this.import(records);
    }
    async resolveProduct(productInput, brandId, categoryId, sportId) {
        const existingProduct = await this.tx.product.findFirst({
            where: {
                name: productInput.name,
                brandId,
                categoryId,
                sportId,
            },
        });
        if (existingProduct) {
            return {
                product: existingProduct,
                created: false,
            };
        }
        const code = await this.generateUniqueProductCode(productInput.name);
        const slug = await this.generateUniqueProductSlug(productInput.name);
        const product = await this.tx.product.create({
            data: {
                name: productInput.name,
                code,
                slug,
                brandId,
                categoryId,
                sportId,
            },
        });
        return {
            product,
            created: true,
        };
    }
    async resolveVariant(productId, productInput) {
        const existingVariant = await this.tx.productVariant.findUnique({
            where: {
                sku: productInput.supplierSku,
            },
        });
        if (existingVariant) {
            const variantUpdated = await this.updateVariantIfNeeded(existingVariant, productInput);
            return {
                variant: variantUpdated
                    ? await this.tx.productVariant.findUniqueOrThrow({
                        where: {
                            id: existingVariant.id,
                        },
                    })
                    : existingVariant,
                created: false,
            };
        }
        const slug = await this.generateUniqueVariantSlug(productInput.name, productInput.supplierSku);
        const variant = await this.tx.productVariant.create({
            data: {
                productId,
                name: productInput.name,
                sku: productInput.supplierSku,
                slug,
            },
        });
        return {
            variant,
            created: true,
        };
    }
    async updateProductIfNeeded(product, productInput, brandId, categoryId, sportId) {
        if (product.name === productInput.name &&
            product.brandId === brandId &&
            product.categoryId === categoryId &&
            product.sportId === sportId) {
            return false;
        }
        await this.tx.product.update({
            where: {
                id: product.id,
            },
            data: {
                name: productInput.name,
                brandId,
                categoryId,
                sportId,
            },
        });
        return true;
    }
    async updateVariantIfNeeded(variant, productInput) {
        if (variant.name === productInput.name) {
            return false;
        }
        const slug = await this.generateUniqueVariantSlug(productInput.name, variant.sku, variant.id);
        await this.tx.productVariant.update({
            where: {
                id: variant.id,
            },
            data: {
                name: productInput.name,
                slug,
            },
        });
        return true;
    }
    async generateUniqueProductCode(name) {
        const sanitizedName = name
            .replace(/[^A-Za-z0-9]/g, '')
            .toUpperCase();
        const base = sanitizedName.substring(0, 3) || 'PRD';
        let code = base;
        let suffix = 1;
        while (await this.tx.product.findUnique({ where: { code } })) {
            code = `${base}${suffix.toString().padStart(2, '0')}`;
            suffix += 1;
        }
        return code;
    }
    async generateUniqueProductSlug(name) {
        const base = this.slugify(name) || 'product';
        let slug = base;
        let suffix = 1;
        while (await this.tx.product.findUnique({ where: { slug } })) {
            slug = `${base}-${suffix}`;
            suffix += 1;
        }
        return slug;
    }
    async generateUniqueVariantSlug(name, sku, excludeVariantId) {
        const nameSlug = this.slugify(name) || 'variant';
        const skuSlug = this.slugify(sku) || 'sku';
        let slug = `${nameSlug}-${skuSlug}`;
        let suffix = 1;
        while (true) {
            const existing = await this.tx.productVariant.findUnique({
                where: {
                    slug,
                },
            });
            if (!existing || existing.id === excludeVariantId) {
                return slug;
            }
            slug = `${nameSlug}-${skuSlug}-${suffix}`;
            suffix += 1;
        }
    }
    slugify(value) {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
exports.SupplierProductImporter = SupplierProductImporter;
