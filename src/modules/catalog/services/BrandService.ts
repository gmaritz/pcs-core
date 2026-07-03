// ==========================================================
// Imports
// ==========================================================

import { Brand, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import {
  brandCodeService,
  slugService,
} from '../../shared/services';
import {
  CreateBrandDto,
  UpdateBrandDto,
} from '../types/brand.dto';

// ==========================================================
// Brand Service
// ==========================================================

export class BrandService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single brand.
   */
  async getBrand(id: string): Promise<Brand | null> {

    return this.db.brand.findUnique({
      where: { id },
    });

  }

  /**
   * Retrieve brands.
   *
   * Supports filtering, pagination,
   * sorting and includes.
   */
  async getBrands(
    options?: Prisma.BrandFindManyArgs,
  ): Promise<Brand[]> {

    return this.db.brand.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new brand.
   */
  async createBrand(
    dto: CreateBrandDto,
  ): Promise<Brand> {

    const slug = slugService.generate(dto.name);

    // TODO:
    // Replace with unique code generation once the
    // Brand numbering strategy has been implemented.
    const code = brandCodeService.generate(dto.name);

    const data: Prisma.BrandCreateInput = {

      name: dto.name,

      code,

      slug,

      description: dto.description,

      website: dto.website,

      logoUrl: dto.logoUrl,

      displayOrder: dto.displayOrder ?? 0,

      sport: {
        connect: {
          id: dto.sportId,
        },
      },

    };

    return this.db.brand.create({
      data,
    });

  }

  /**
   * Update an existing brand.
   */
  async updateBrand(
    id: string,
    dto: UpdateBrandDto,
  ): Promise<Brand> {

    const data: Prisma.BrandUpdateInput = {};

    if (dto.name !== undefined) {

      data.name = dto.name;
      data.slug = slugService.generate(dto.name);

      // NOTE:
      // Brand codes remain unchanged once created.

    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.website !== undefined) {
      data.website = dto.website;
    }

    if (dto.logoUrl !== undefined) {
      data.logoUrl = dto.logoUrl;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    if (dto.sportId !== undefined) {

      data.sport = {
        connect: {
          id: dto.sportId,
        },
      };

    }

    return this.db.brand.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a brand.
   */
  async deleteBrand(
    id: string,
  ): Promise<Brand> {

    return this.db.brand.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const brandService = new BrandService();