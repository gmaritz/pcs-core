// ==========================================================
// Imports
// ==========================================================

import {
  RecordStatus,
} from '@prisma/client';

import {
  BaseService,
} from '../../shared/services/BaseService';

import {
  productSearchEngine,
} from '../engines';
import {
  productSearchMapper,
} from '../mappers';
import {
  ProductSearchCriteria,
  ProductSearchRecord,
  ProductSearchRequest,
  ProductSearchResponse,
} from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// ==========================================================
// Product Search Service
// ==========================================================

export class ProductSearchService extends BaseService {

  async search(
    request: ProductSearchRequest,
  ): Promise<ProductSearchResponse> {

    const criteria = this.buildCriteria(
      request,
    );

    const records = await this.loadSearchRecords();

    const result = productSearchEngine.search(
      records,
      criteria,
    );

    return {
      page: criteria.page,
      pageSize: criteria.pageSize,
      total: result.total,
      results: result.records.map((record) =>
        productSearchMapper.toResultItem(record)),
    };

  }

  private buildCriteria(
    request: ProductSearchRequest,
  ): ProductSearchCriteria {

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

  private async loadSearchRecords(): Promise<ProductSearchRecord[]> {

    const products = await this.db.product.findMany({
      where: {
        status: RecordStatus.ACTIVE,
      },
      include: {
        brand: true,
        category: true,
        sport: true,
        variants: {
          where: {
            status: RecordStatus.ACTIVE,
          },
          include: {
            inventory: true,
          },
        },
      },
    });

    const records: ProductSearchRecord[] = [];

    for (const product of products) {

      for (const variant of product.variants) {

        if (!variant.sellingPrice) {
          continue;
        }

        const availableQuantity = variant.inventory.reduce(
          (total, inventory) =>
            total + (
              inventory.quantityOnHand -
              inventory.quantityReserved
            ),
          0,
        );

        records.push({
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          productDescription: [
            product.shortDescription,
            product.description,
            variant.description,
          ].filter((value): value is string => Boolean(value)).join(' '),
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

    }

    return records;

  }

}

function normalizeOptional(
  value?: string,
): string | undefined {

  if (!value?.trim()) {
    return undefined;
  }

  return value.trim();

}

export const productSearchService =
  new ProductSearchService();
