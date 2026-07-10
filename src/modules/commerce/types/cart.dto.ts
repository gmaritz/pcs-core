// ==========================================================
// Cart DTOs
// ==========================================================

import { CartStatus } from '@prisma/client';

/**
 * Request payload for creating a cart.
 */
export interface CreateCartDto {

  customerId: string;

}

/**
 * Request payload for updating a cart.
 */
export interface UpdateCartDto {

  status?: CartStatus;

}
