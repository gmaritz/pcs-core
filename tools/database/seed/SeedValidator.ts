import { readFileSync } from 'node:fs';
import path from 'node:path';

import { SeedContext } from './SeedContext';

export type SeedValidationResult = {
  warnings: string[];
  errors: string[];
  passed: boolean;
};

function parseVersion(version: string): [number, number, number] {
  const [major, minor, patch] = version.split('.').map((part) => Number.parseInt(part, 10) || 0);
  return [major, minor, patch];
}

function isVersionCompatible(platformVersion: string, minimumVersion: string): boolean {
  const left = parseVersion(platformVersion);
  const right = parseVersion(minimumVersion);

  if (left[0] !== right[0]) {
    return left[0] > right[0];
  }

  if (left[1] !== right[1]) {
    return left[1] > right[1];
  }

  return left[2] >= right[2];
}

export class SeedValidator {
  resolvePlatformVersion(context: SeedContext): string {
    const packageJsonPath = path.join(context.repoRoot, 'package.json');
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version?: string };
    return pkg.version ?? '0.0.0';
  }

  async validate(context: SeedContext): Promise<SeedValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const platformVersion = this.resolvePlatformVersion(context);

    if (!context.dataset.manifest.version.trim()) {
      errors.push('Dataset manifest version is required.');
    }

    if (!context.dataset.manifest.minimumPlatformVersion.trim()) {
      errors.push('Dataset minimumPlatformVersion is required.');
    }

    if (!isVersionCompatible(platformVersion, context.dataset.manifest.minimumPlatformVersion)) {
      errors.push(`Platform version ${platformVersion} is not compatible with minimum ${context.dataset.manifest.minimumPlatformVersion}.`);
    }

    const [
      sports,
      categories,
      brands,
      products,
      variants,
      suppliers,
      customers,
      orders,
      inventories,
      pricedVariants,
      productsWithMedia,
      duplicateVariantNames,
      duplicateSupplierProducts,
    ] = await Promise.all([
      context.db.sport.count(),
      context.db.category.count(),
      context.db.brand.count(),
      context.db.product.count(),
      context.db.productVariant.count(),
      context.db.supplier.count(),
      context.db.customer.count(),
      context.db.order.count(),
      context.db.inventory.count(),
      context.db.productVariant.count({ where: { sellingPrice: { not: null } } }),
      context.db.product.count({ where: { media: { some: {} } } }),
      context.db.productVariant.groupBy({
        by: ['productId', 'name'],
        _count: {
          _all: true,
        },
        having: {
          name: {
            _count: {
              gt: 1,
            },
          },
        },
      }),
      context.db.supplierProduct.groupBy({
        by: ['supplierId', 'productVariantId'],
        _count: {
          _all: true,
        },
        having: {
          supplierId: {
            _count: {
              gt: 1,
            },
          },
        },
      }),
    ]);

    if (sports < 8) {
      errors.push(`Expected at least 8 sports but found ${sports}.`);
    }

    if (categories < 20) {
      errors.push(`Expected at least 20 categories but found ${categories}.`);
    }

    if (brands < 12) {
      errors.push(`Expected at least 12 brands but found ${brands}.`);
    }

    if (products < 100) {
      errors.push(`Expected at least 100 products but found ${products}.`);
    }

    if (variants < 250) {
      errors.push(`Expected at least 250 variants but found ${variants}.`);
    }

    if (suppliers < 5) {
      errors.push(`Expected at least 5 suppliers but found ${suppliers}.`);
    }

    if (customers < 25) {
      errors.push(`Expected at least 25 customers but found ${customers}.`);
    }

    if (orders < 50) {
      errors.push(`Expected at least 50 orders but found ${orders}.`);
    }

    if (inventories !== variants) {
      errors.push(`Expected inventory records to match variant count (${variants}) but found ${inventories}.`);
    }

    if (pricedVariants !== variants) {
      errors.push(`Expected all variants to have selling prices. Found ${pricedVariants}/${variants}.`);
    }

    if (productsWithMedia !== products) {
      errors.push(`Expected all products to have media. Found ${productsWithMedia}/${products}.`);
    }

    if (duplicateVariantNames.length > 0) {
      errors.push(`Found ${duplicateVariantNames.length} duplicate product variant names within products.`);
    }

    if (duplicateSupplierProducts.length > 0) {
      errors.push(`Found ${duplicateSupplierProducts.length} duplicate supplier-product records.`);
    }

    const zeroInventory = await context.db.inventory.count({
      where: {
        quantityOnHand: {
          lte: 0,
        },
      },
    });

    if (zeroInventory > 0) {
      warnings.push(`Detected ${zeroInventory} inventory rows with non-positive quantity on hand.`);
    }

    return {
      warnings,
      errors,
      passed: errors.length === 0,
    };
  }
}
