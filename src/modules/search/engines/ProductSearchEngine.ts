// ==========================================================
// Imports
// ==========================================================

import {
  productFilter,
} from '../filters';
import {
  ProductSearchCriteria,
  ProductSearchEngineResult,
  ProductSearchRecord,
  ProductSearchSort,
} from '../types';

interface ScoredRecord {
  record: ProductSearchRecord;
  relevanceScore: number;
}

// ==========================================================
// Product Search Engine
// ==========================================================

export class ProductSearchEngine {

  search(
    records: ProductSearchRecord[],
    criteria: ProductSearchCriteria,
  ): ProductSearchEngineResult {

    const filteredRecords = productFilter.apply(
      records,
      criteria,
    );

    const keywordMatched = this.applyKeywordSearch(
      filteredRecords,
      criteria.q,
    );

    const sorted = this.sort(
      keywordMatched,
      criteria.sort,
    );

    const total = sorted.length;

    const start =
      (criteria.page - 1) * criteria.pageSize;

    const end = start + criteria.pageSize;

    const paged = sorted.slice(start, end);

    return {
      total,
      records: paged.map((entry) => entry.record),
    };

  }

  private applyKeywordSearch(
    records: ProductSearchRecord[],
    keyword?: string,
  ): ScoredRecord[] {

    if (!keyword?.trim()) {
      return records.map((record) => ({
        record,
        relevanceScore: 0,
      }));
    }

    const terms = keyword
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    return records
      .map((record) => ({
        record,
        relevanceScore: calculateRelevanceScore(record, terms),
      }))
      .filter((entry) => entry.relevanceScore > 0);

  }

  private sort(
    records: ScoredRecord[],
    sort: ProductSearchSort,
  ): ScoredRecord[] {

    const sorted = [...records];

    sorted.sort((left, right) => {

      switch (sort) {
        case 'price-asc':
          return left.record.sellingPrice - right.record.sellingPrice;

        case 'price-desc':
          return right.record.sellingPrice - left.record.sellingPrice;

        case 'name-asc':
          return left.record.productName.localeCompare(right.record.productName);

        case 'name-desc':
          return right.record.productName.localeCompare(left.record.productName);

        case 'newest':
          return right.record.productCreatedAt.getTime() - left.record.productCreatedAt.getTime();

        case 'relevance':
        default:
          if (right.relevanceScore !== left.relevanceScore) {
            return right.relevanceScore - left.relevanceScore;
          }

          return right.record.productCreatedAt.getTime() - left.record.productCreatedAt.getTime();
      }

    });

    return sorted;

  }

}

function calculateRelevanceScore(
  record: ProductSearchRecord,
  terms: string[],
): number {

  const productName = record.productName.toLowerCase();
  const variantName = record.variantName.toLowerCase();
  const description = record.productDescription.toLowerCase();
  const brand = record.brandName.toLowerCase();
  const category = record.categoryName.toLowerCase();
  const sport = record.sportName.toLowerCase();

  let score = 0;

  for (const term of terms) {

    if (productName.includes(term)) {
      score += 5;
    }

    if (variantName.includes(term)) {
      score += 4;
    }

    if (brand.includes(term)) {
      score += 3;
    }

    if (category.includes(term)) {
      score += 3;
    }

    if (sport.includes(term)) {
      score += 3;
    }

    if (description.includes(term)) {
      score += 1;
    }

  }

  return score;

}

export const productSearchEngine =
  new ProductSearchEngine();
