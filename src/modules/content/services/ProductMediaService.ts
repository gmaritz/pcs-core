// ==========================================================
// Imports
// ==========================================================

import { Prisma, ProductMedia } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

import {
  CreateProductMediaDto,
  UpdateProductMediaDto,
} from '../types/product-media.dto';

// ==========================================================
// Product Media Service
// ==========================================================

export class ProductMediaService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve product media records.
   */
  async getProductMedia(
    options?: Prisma.ProductMediaFindManyArgs,
  ): Promise<ProductMedia[]> {

    return this.db.productMedia.findMany(options);

  }

  /**
   * Retrieve a single product media record by its unique identifier.
   */
  async getProductMediaItem(
    id: string,
  ): Promise<ProductMedia | null> {

    return this.db.productMedia.findUnique({

      where: { id },

    });

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new product media record.
   */
  async createProductMedia(
    dto: CreateProductMediaDto,
  ): Promise<ProductMedia> {

    const data: Prisma.ProductMediaCreateInput = {

      mediaRole: dto.mediaRole ?? 'GALLERY',

      displayOrder: dto.displayOrder ?? 0,

      isPrimary: dto.isPrimary ?? false,

      product: {
        connect: {
          id: dto.productId,
        },
      },

      media: {
        connect: {
          id: dto.mediaId,
        },
      },

    };

    return this.db.productMedia.create({

      data,

    });

  }

  /**
   * Update an existing product media record.
   */
  async updateProductMedia(
    id: string,
    dto: UpdateProductMediaDto,
  ): Promise<ProductMedia> {

    const data: Prisma.ProductMediaUpdateInput = {};

    if (dto.mediaRole !== undefined) {
      data.mediaRole = dto.mediaRole;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder = dto.displayOrder;
    }

    if (dto.isPrimary !== undefined) {
      data.isPrimary = dto.isPrimary;
    }

    return this.db.productMedia.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a product media record.
   */
  async deleteProductMedia(
    id: string,
  ): Promise<ProductMedia> {

    return this.db.productMedia.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const productMediaService =
  new ProductMediaService();
