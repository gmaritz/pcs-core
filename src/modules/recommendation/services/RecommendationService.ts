import {
  Prisma,
  RecordStatus,
} from '@prisma/client';

import {
  productService,
} from '../../catalog/services';

import {
  RecommendationCriteria,
  RecommendationResult,
} from '../types';

const DEFAULT_RECOMMENDATION_LIMIT = 4;

type RecommendationProductRecord = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    sport: true;
    variants: {
      include: {
        inventory: true;
      };
    };
  };
}>;

type RankedRecommendation = {
  rank: number;
  isAvailable: boolean;
  item: RecommendationResult;
};

export class RecommendationService {
  async resolveRelatedProducts(
    criteria: RecommendationCriteria,
  ): Promise<RecommendationResult[]> {
    const limit = criteria.limit ?? DEFAULT_RECOMMENDATION_LIMIT;

    const candidates = await productService.getProducts({
      where: {
        status: RecordStatus.ACTIVE,
        id: {
          not: criteria.productId,
        },
        OR: [
          {
            categoryId: criteria.categoryId,
          },
          {
            brandId: criteria.brandId,
          },
          {
            sportId: criteria.sportId,
          },
        ],
        variants: {
          some: {
            status: RecordStatus.ACTIVE,
            sellingPrice: {
              not: null,
            },
          },
        },
      },
      include: {
        brand: true,
        sport: true,
        variants: {
          where: {
            status: RecordStatus.ACTIVE,
            sellingPrice: {
              not: null,
            },
          },
          include: {
            inventory: true,
          },
          orderBy: [
            {
              isDefault: 'desc',
            },
            {
              displayOrder: 'asc',
            },
            {
              createdAt: 'asc',
            },
          ],
        },
      },
      orderBy: [
        {
          displayOrder: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
      take: limit * 4,
    }) as RecommendationProductRecord[];

    const ranked = candidates
      .map((product) => this.mapRecommendation(product, criteria))
      .filter((item): item is RankedRecommendation => Boolean(item))
      .sort((left, right) => {
        if (left.rank !== right.rank) {
          return left.rank - right.rank;
        }

        if (left.isAvailable !== right.isAvailable) {
          return left.isAvailable ? -1 : 1;
        }

        return left.item.productName.localeCompare(right.item.productName);
      })
      .slice(0, limit)
      .map((entry) => entry.item);

    return ranked;
  }

  private mapRecommendation(
    product: RecommendationProductRecord,
    criteria: RecommendationCriteria,
  ): RankedRecommendation | undefined {
    const variant = product.variants[0];

    if (!variant || variant.sellingPrice === null) {
      return undefined;
    }

    const availableQuantity = variant.inventory.reduce(
      (sum, inventory) => (
        sum + (inventory.quantityOnHand - inventory.quantityReserved)
      ),
      0,
    );

    const rank = this.resolveRank(product, criteria);

    if (rank === Number.POSITIVE_INFINITY) {
      return undefined;
    }

    return {
      rank,
      isAvailable: availableQuantity > 0,
      item: {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        brandName: product.brand.name,
        sportName: product.sport.name,
        variantId: variant.id,
        variantSku: variant.sku,
        sellingPrice: Number(variant.sellingPrice),
        isAvailable: availableQuantity > 0,
      },
    };
  }

  private resolveRank(
    product: RecommendationProductRecord,
    criteria: RecommendationCriteria,
  ): number {
    if (product.categoryId === criteria.categoryId) {
      return 1;
    }

    if (product.brandId === criteria.brandId) {
      return 2;
    }

    if (product.sportId === criteria.sportId) {
      return 3;
    }

    return Number.POSITIVE_INFINITY;
  }
}

export const recommendationService =
  new RecommendationService();
