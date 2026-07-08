// ==========================================================
// Customer DTOs
// ==========================================================

/**
 * Request payload for creating a customer.
 */
export interface CreateCustomerDto {

  firstName: string;

  lastName: string;

  email: string;

  telephone?: string;

  company?: string;

}

/**
 * Request payload for updating a customer.
 */
export interface UpdateCustomerDto {

  firstName?: string;

  lastName?: string;

  email?: string;

  telephone?: string;

  company?: string;

}
