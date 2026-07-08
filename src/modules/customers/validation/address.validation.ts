// ==========================================================
// Address Validation
// ==========================================================

import { AddressType } from '@prisma/client';

import {
  CreateAddressDto,
  UpdateAddressDto,
} from '../types/address.dto';

const ADDRESS_TYPES: AddressType[] = [
  'SHIPPING',
  'BILLING',
];

function isValidAddressType(
  type: string,
): type is AddressType {

  return ADDRESS_TYPES.includes(
    type as AddressType,
  );

}

export function validateCreateAddress(
  dto: CreateAddressDto,
): void {

  if (!dto.type) {
    throw new Error('Address type is required.');
  }

  if (!isValidAddressType(dto.type)) {
    throw new Error('Address type must be SHIPPING or BILLING.');
  }

  if (!dto.line1?.trim()) {
    throw new Error('Address line1 is required.');
  }

  if (!dto.city?.trim()) {
    throw new Error('Address city is required.');
  }

  if (!dto.province?.trim()) {
    throw new Error('Address province is required.');
  }

  if (!dto.postalCode?.trim()) {
    throw new Error('Address postalCode is required.');
  }

  if (!dto.country?.trim()) {
    throw new Error('Address country is required.');
  }

  if (!dto.customerId?.trim()) {
    throw new Error('Customer id is required.');
  }

}

export function validateUpdateAddress(
  dto: UpdateAddressDto,
): void {

  if (
    dto.type !== undefined &&
    !isValidAddressType(dto.type)
  ) {
    throw new Error('Address type must be SHIPPING or BILLING.');
  }

  if (
    dto.line1 !== undefined &&
    !dto.line1.trim()
  ) {
    throw new Error(
      'Address line1 cannot be empty.',
    );
  }

  if (
    dto.city !== undefined &&
    !dto.city.trim()
  ) {
    throw new Error(
      'Address city cannot be empty.',
    );
  }

  if (
    dto.province !== undefined &&
    !dto.province.trim()
  ) {
    throw new Error(
      'Address province cannot be empty.',
    );
  }

  if (
    dto.postalCode !== undefined &&
    !dto.postalCode.trim()
  ) {
    throw new Error(
      'Address postalCode cannot be empty.',
    );
  }

  if (
    dto.country !== undefined &&
    !dto.country.trim()
  ) {
    throw new Error(
      'Address country cannot be empty.',
    );
  }

}
