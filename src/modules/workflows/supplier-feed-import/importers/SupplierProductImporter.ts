// ==========================================================
// Supplier Product Importer
// ==========================================================

import {
  Prisma,
  Product,
  ProductVariant,
} from '@prisma/client';

import {
  ImportReferenceData,
  SupplierImportRecord,
  SupplierImportSummaryDraft,
} from '../types';

function normalizeName(
  value: string,
): string {

  return value.trim().toLowerCase();

}

export class SupplierProductImporter {

  constructor(
    private readonly tx: Prisma.TransactionClient,
    private readonly supplierId: string,
    private readonly references: ImportReferenceData,
  ) {}

  async importRecords(
    records: SupplierImportRecord[],
  ): Promise<SupplierImportSummaryDraft> {

    const summary: SupplierImportSummaryDraft = {
      createdProducts: 0,
      updatedProducts: 0,
      createdVariants: 0,
      updatedVariants: 0,
      createdInventory: 0,
      updatedInventory: 0,
    };

    const forceFailureAfterFirstRecord =
      process.env.WF005_FORCE_EXCEPTION_AFTER_FIRST_RECORD === 'true';

    for (const [index, record] of records.entries()) {

      const brand = this.references.brandsByName.get(
        normalizeName(record.brand),
      );
      const category = this.references.categoriesByName.get(
        normalizeName(record.category),
      );
      const sport = this.references.sportsByName.get(
        normalizeName(record.sport),
      );

      if (!brand || !category || !sport) {
        throw new Error('Validation references missing during import.');
      }

      const supplierProduct = await this.tx.supplierProduct.findFirst({

        where: {
          supplierId: this.supplierId,
          supplierSku: record.supplierSku,
        },

        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },

      });

      let product: Product;
      let variant: ProductVariant;

      if (supplierProduct) {

        product = supplierProduct.productVariant.product;
        variant = supplierProduct.productVariant;

        const productUpdated = await this.updateProductIfNeeded(
          product,
          record,
          brand.id,
          category.id,
          sport.id,
        );

        if (productUpdated) {
          summary.updatedProducts += 1;
        }

        const variantUpdated = await this.updateVariantIfNeeded(
          variant,
          record,
        );

        if (variantUpdated) {
          summary.updatedVariants += 1;
        }

        await this.tx.supplierProduct.update({

          where: {
            id: supplierProduct.id,
          },

          data: {
            supplierProductName: record.name,
            supplierPrice: new Prisma.Decimal(record.price),
            active: true,
          },

        });

      } else {

        const productResult = await this.resolveProduct(
          record,
          brand.id,
          category.id,
          sport.id,
        );

        product = productResult.product;

        if (productResult.created) {
          summary.createdProducts += 1;
        } else {
          summary.updatedProducts += 1;
        }

        const variantResult = await this.resolveVariant(
          product.id,
          record,
        );

        variant = variantResult.variant;

        if (variantResult.created) {
          summary.createdVariants += 1;
        } else {
          summary.updatedVariants += 1;
        }

        await this.tx.supplierProduct.create({

          data: {
            supplierId: this.supplierId,
            supplierSku: record.supplierSku,
            supplierProductName: record.name,
            supplierPrice: new Prisma.Decimal(record.price),
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
            quantityOnHand: record.quantity,
          },

        });

        summary.createdInventory += 1;

      } else {

        await this.tx.inventory.update({

          where: {
            id: inventory.id,
          },

          data: {
            quantityOnHand: record.quantity,
          },

        });

        summary.updatedInventory += 1;

      }

      if (
        forceFailureAfterFirstRecord &&
        index === 0
      ) {
        throw new Error('Forced WF-005 rollback verification failure.');
      }

    }

    return summary;

  }

  private async resolveProduct(
    record: SupplierImportRecord,
    brandId: string,
    categoryId: string,
    sportId: string,
  ): Promise<{ product: Product; created: boolean }> {

    const existingProduct = await this.tx.product.findFirst({

      where: {
        name: record.name,
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

    const code = await this.generateUniqueProductCode(
      record.name,
    );

    const slug = await this.generateUniqueProductSlug(
      record.name,
    );

    const product = await this.tx.product.create({

      data: {
        name: record.name,
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

  private async resolveVariant(
    productId: string,
    record: SupplierImportRecord,
  ): Promise<{ variant: ProductVariant; created: boolean }> {

    const existingVariant = await this.tx.productVariant.findUnique({

      where: {
        sku: record.supplierSku,
      },

    });

    if (existingVariant) {

      const variantUpdated = await this.updateVariantIfNeeded(
        existingVariant,
        record,
      );

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

    const slug = await this.generateUniqueVariantSlug(
      record.name,
      record.supplierSku,
    );

    const variant = await this.tx.productVariant.create({

      data: {
        productId,
        name: record.name,
        sku: record.supplierSku,
        slug,
      },

    });

    return {
      variant,
      created: true,
    };

  }

  private async updateProductIfNeeded(
    product: Product,
    record: SupplierImportRecord,
    brandId: string,
    categoryId: string,
    sportId: string,
  ): Promise<boolean> {

    if (
      product.name === record.name &&
      product.brandId === brandId &&
      product.categoryId === categoryId &&
      product.sportId === sportId
    ) {
      return false;
    }

    await this.tx.product.update({

      where: {
        id: product.id,
      },

      data: {
        name: record.name,
        brandId,
        categoryId,
        sportId,
      },

    });

    return true;

  }

  private async updateVariantIfNeeded(
    variant: ProductVariant,
    record: SupplierImportRecord,
  ): Promise<boolean> {

    if (variant.name === record.name) {
      return false;
    }

    const slug = await this.generateUniqueVariantSlug(
      record.name,
      variant.sku,
      variant.id,
    );

    await this.tx.productVariant.update({

      where: {
        id: variant.id,
      },

      data: {
        name: record.name,
        slug,
      },

    });

    return true;

  }

  private async generateUniqueProductCode(
    name: string,
  ): Promise<string> {

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

  private async generateUniqueProductSlug(
    name: string,
  ): Promise<string> {

    const base = this.slugify(name) || 'product';

    let slug = base;
    let suffix = 1;

    while (await this.tx.product.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }

    return slug;

  }

  private async generateUniqueVariantSlug(
    name: string,
    sku: string,
    excludeVariantId?: string,
  ): Promise<string> {

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

  private slugify(
    value: string,
  ): string {

    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  }

}
