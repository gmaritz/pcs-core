// ==========================================================
// PCS Core Service Types
// ==========================================================

/**
 * Standard pagination options.
 */
export interface PaginationOptions {

  skip?: number;

  take?: number;

}

/**
 * Standard sorting options.
 */
export interface SortOptions<T> {

  orderBy?: T;

}

/**
 * Standard query options shared by all services.
 */
export interface QueryOptions<T> extends PaginationOptions, SortOptions<T> {

  where?: T;

}