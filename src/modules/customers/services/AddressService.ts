// ==========================================================
// Imports
// ==========================================================

import { Address, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  CreateAddressDto,
  UpdateAddressDto,
} from '../types/address.dto';

// ==========================================================
// Address Service
// ==========================================================

export class AddressService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single address by its unique identifier.
   */
  async getAddress(
    id: string,
  ): Promise<Address | null> {

    return this.db.address.findUnique({

      where: { id },

    });

  }

  /**
 * Retrieve addresses.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
 */
  async getAddresses(
    options?: Prisma.AddressFindManyArgs,
  ): Promise<Address[]> {

    return this.db.address.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new address.
   */
  async createAddress(
    dto: CreateAddressDto,
  ): Promise<Address> {

    const data: Prisma.AddressCreateInput = {

      type: dto.type,

      line1: dto.line1,

      line2: dto.line2,

      suburb: dto.suburb,

      city: dto.city,

      province: dto.province,

      postalCode: dto.postalCode,

      country: dto.country,

      contactName: dto.contactName,

      contactPhone: dto.contactPhone,

      company: dto.company,

      customer: {
        connect: {
          id: dto.customerId,
        },
      },

    };

    return this.db.address.create({

      data,

    });

  }

  /**
   * Update an existing address.
   */
  async updateAddress(
    id: string,
    dto: UpdateAddressDto,
  ): Promise<Address> {

    const data: Prisma.AddressUpdateInput = {};

    if (dto.type !== undefined) {
      data.type = dto.type;
    }

    if (dto.line1 !== undefined) {
      data.line1 = dto.line1;
    }

    if (dto.line2 !== undefined) {
      data.line2 = dto.line2;
    }

    if (dto.suburb !== undefined) {
      data.suburb = dto.suburb;
    }

    if (dto.city !== undefined) {
      data.city = dto.city;
    }

    if (dto.province !== undefined) {
      data.province = dto.province;
    }

    if (dto.postalCode !== undefined) {
      data.postalCode = dto.postalCode;
    }

    if (dto.country !== undefined) {
      data.country = dto.country;
    }

    if (dto.contactName !== undefined) {
      data.contactName = dto.contactName;
    }

    if (dto.contactPhone !== undefined) {
      data.contactPhone = dto.contactPhone;
    }

    if (dto.company !== undefined) {
      data.company = dto.company;
    }

    if (dto.customerId !== undefined) {

      data.customer = {
        connect: {
          id: dto.customerId,
        },
      };

    }

    return this.db.address.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete an address.
   */
  async deleteAddress(
    id: string,
  ): Promise<Address> {

    return this.db.address.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const addressService = new AddressService();
