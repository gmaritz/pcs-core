// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateAddressDto,
  UpdateAddressDto,
} from '../types/address.dto';

import { addressService } from '../services';

import {
  validateCreateAddress,
  validateUpdateAddress,
} from '../validation/address.validation';

// ==========================================================
// Address Controller
// ==========================================================

export class AddressController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all addresses.
   */
  async getAddresses(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const addresses =
      await addressService.getAddresses();

    ApiResponse.success(
      res,
      addresses,
    );

  }

  /**
   * Retrieve a single address.
   */
  async getAddress(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const address =
      await addressService.getAddress(
        req.params.id,
      );

    if (!address) {

      ApiResponse.notFound(
        res,
        'Address not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      address,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createAddress(
    req: Request<
      unknown,
      unknown,
      CreateAddressDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateAddress(
      req.body,
    );

    const address =
      await addressService.createAddress(
        req.body,
      );

    ApiResponse.created(
      res,
      address,
    );

  }

  async updateAddress(
    req: Request<
      IdParams,
      unknown,
      UpdateAddressDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateAddress(
      req.body,
    );

    const address =
      await addressService.updateAddress(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      address,
    );

  }

  async deleteAddress(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await addressService.deleteAddress(
      req.params.id,
    );

    ApiResponse.noContent(
      res,
    );

  }

}

// ==========================================================
// Controller Instance
// ==========================================================

export const addressController =
  new AddressController();
