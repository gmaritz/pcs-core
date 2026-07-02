import { Brand, Prisma } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

export class BrandService extends BaseService {

  /**
   * Create a new brand.
   */
  async createBrand(data: Prisma.BrandCreateInput): Promise<Brand> {
    return this.db.brand.create({
      data,
    });
  }

  /**
   * Find a brand by its ID.
   */
  async getBrand(id: string): Promise<Brand | null> {
    return this.db.brand.findUnique({
      where: { id },
    });
  }

  /**
   * Return all brands.
   */
  async getBrands(): Promise<Brand[]> {
    return this.db.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Update a brand.
   */
  async updateBrand(
    id: string,
    data: Prisma.BrandUpdateInput,
  ): Promise<Brand> {
    return this.db.brand.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a brand.
   */
  async deleteBrand(id: string): Promise<Brand> {
    return this.db.brand.delete({
      where: { id },
    });
  }

}

export const brandService = new BrandService();