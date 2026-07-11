// ==========================================================
// Imports
// ==========================================================

import { Prisma, SeoMetadata } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

import {
  CreateSeoMetadataDto,
  UpdateSeoMetadataDto,
} from '../types/seo-metadata.dto';

// ==========================================================
// SEO Metadata Service
// ==========================================================

export class SeoMetadataService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve SEO metadata records.
   */
  async getSeoMetadata(
    options?: Prisma.SeoMetadataFindManyArgs,
  ): Promise<SeoMetadata[]> {

    return this.db.seoMetadata.findMany(options);

  }

  /**
   * Retrieve a single SEO metadata record by its unique identifier.
   */
  async getSeoMetadataItem(
    id: string,
  ): Promise<SeoMetadata | null> {

    return this.db.seoMetadata.findUnique({

      where: { id },

    });

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new SEO metadata record.
   */
  async createSeoMetadata(
    dto: CreateSeoMetadataDto,
  ): Promise<SeoMetadata> {

    const data: Prisma.SeoMetadataCreateInput = {

      metaTitle: dto.metaTitle,

      metaDescription: dto.metaDescription,

      metaKeywords: dto.metaKeywords,

      canonicalUrl: dto.canonicalUrl,

      ogTitle: dto.ogTitle,

      ogDescription: dto.ogDescription,

      ogImageUrl: dto.ogImageUrl,

      product: {
        connect: {
          id: dto.productId,
        },
      },

    };

    return this.db.seoMetadata.create({

      data,

    });

  }

  /**
   * Update an existing SEO metadata record.
   */
  async updateSeoMetadata(
    id: string,
    dto: UpdateSeoMetadataDto,
  ): Promise<SeoMetadata> {

    const data: Prisma.SeoMetadataUpdateInput = {};

    if (dto.productId !== undefined) {
      data.product = {
        connect: {
          id: dto.productId,
        },
      };
    }

    if (dto.metaTitle !== undefined) {
      data.metaTitle = dto.metaTitle;
    }

    if (dto.metaDescription !== undefined) {
      data.metaDescription = dto.metaDescription;
    }

    if (dto.metaKeywords !== undefined) {
      data.metaKeywords = dto.metaKeywords;
    }

    if (dto.canonicalUrl !== undefined) {
      data.canonicalUrl = dto.canonicalUrl;
    }

    if (dto.ogTitle !== undefined) {
      data.ogTitle = dto.ogTitle;
    }

    if (dto.ogDescription !== undefined) {
      data.ogDescription = dto.ogDescription;
    }

    if (dto.ogImageUrl !== undefined) {
      data.ogImageUrl = dto.ogImageUrl;
    }

    return this.db.seoMetadata.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a SEO metadata record.
   */
  async deleteSeoMetadata(
    id: string,
  ): Promise<SeoMetadata> {

    return this.db.seoMetadata.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const seoMetadataService =
  new SeoMetadataService();
