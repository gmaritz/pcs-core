// ==========================================================
// Address DTOs
// ==========================================================

import { AddressType } from '@prisma/client';

/**
 * Request payload for creating an address.
 */
export interface CreateAddressDto {

  type: AddressType;

  line1: string;

  line2?: string;

  suburb?: string;

  city: string;

  province: string;

  postalCode: string;

  country: string;

  contactName?: string;

  contactPhone?: string;

  company?: string;

  customerId: string;

}

/**
 * Request payload for updating an address.
 */
export interface UpdateAddressDto {

  type?: AddressType;

  line1?: string;

  line2?: string;

  suburb?: string;

  city?: string;

  province?: string;

  postalCode?: string;

  country?: string;

  contactName?: string;

  contactPhone?: string;

  company?: string;

  customerId?: string;

}
