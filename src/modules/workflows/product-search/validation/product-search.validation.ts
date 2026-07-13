// ==========================================================
// Imports
// ==========================================================

import {
  ProductSearchQueryDto,
} from '../types';

const ALLOWED_SORT = new Set([
  'relevance',
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
  'newest',
]);

// ==========================================================
// Validation Error
// ==========================================================

export class ProductSearchValidationError extends Error {

  constructor(message: string) {

    super(message);

    this.name = 'ProductSearchValidationError';

  }

}

// ==========================================================
// Validation
// ==========================================================

export function validateProductSearchQuery(
  query: Record<string, unknown>,
): ProductSearchQueryDto {

  const q = getOptionalString(query.q);
  const sport = getOptionalString(query.sport);
  const brand = getOptionalString(query.brand);
  const category = getOptionalString(query.category);

  const minPrice = getOptionalNumber(query.minPrice, 'minPrice');
  const maxPrice = getOptionalNumber(query.maxPrice, 'maxPrice');

  if (minPrice !== undefined && minPrice < 0) {
    throw new ProductSearchValidationError('minPrice cannot be negative.');
  }

  if (maxPrice !== undefined && maxPrice < 0) {
    throw new ProductSearchValidationError('maxPrice cannot be negative.');
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice > maxPrice
  ) {
    throw new ProductSearchValidationError('minPrice cannot be greater than maxPrice.');
  }

  const available = getOptionalBoolean(query.available);

  const page = getOptionalInteger(query.page, 'page') ?? 1;
  const pageSize = getOptionalInteger(query.pageSize, 'pageSize') ?? 20;

  if (page < 1) {
    throw new ProductSearchValidationError('page must be at least 1.');
  }

  if (pageSize < 1) {
    throw new ProductSearchValidationError('pageSize must be at least 1.');
  }

  if (pageSize > 100) {
    throw new ProductSearchValidationError('pageSize cannot exceed 100.');
  }

  const sortRaw = getOptionalString(query.sort);

  if (sortRaw && !ALLOWED_SORT.has(sortRaw)) {
    throw new ProductSearchValidationError('Invalid sort value.');
  }

  const sort = sortRaw as ProductSearchQueryDto['sort'];

  return {
    q,
    sport,
    brand,
    category,
    minPrice,
    maxPrice,
    available,
    page,
    pageSize,
    sort,
  };

}

function getOptionalString(
  value: unknown,
): string | undefined {

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ProductSearchValidationError('Query parameter values must be strings.');
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed;

}

function getOptionalNumber(
  value: unknown,
  field: string,
): number | undefined {

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ProductSearchValidationError(`${field} must be a number.`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new ProductSearchValidationError(`${field} must be a number.`);
  }

  return parsed;

}

function getOptionalInteger(
  value: unknown,
  field: string,
): number | undefined {

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ProductSearchValidationError(`${field} must be an integer.`);
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new ProductSearchValidationError(`${field} must be an integer.`);
  }

  return parsed;

}

function getOptionalBoolean(
  value: unknown,
): boolean | undefined {

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ProductSearchValidationError('available must be a boolean.');
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'true' || normalized === '1') {
    return true;
  }

  if (normalized === 'false' || normalized === '0') {
    return false;
  }

  throw new ProductSearchValidationError('available must be true or false.');

}
