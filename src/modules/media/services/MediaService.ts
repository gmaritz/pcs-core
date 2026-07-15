import {
  MediaRole,
  RecordStatus,
} from '@prisma/client';

import {
  BaseService,
} from '../../shared/services/BaseService';

import {
  MediaResult,
  ProductGalleryResult,
} from '../types';

const PRODUCT_PLACEHOLDER_IMAGE = '/images/products/wilson-clash.jpeg';
const BRAND_PLACEHOLDER_IMAGE = '/images/sports/ProCourtSports.png';
const CATEGORY_PLACEHOLDER_IMAGE = '/images/sports/ProCourtSports.png';
const SPORT_PLACEHOLDER_IMAGE = '/images/sports/ProCourtSports.png';

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'tennis-racquets': '/images/sports/tennis.png',
  'padel-racquets': '/images/sports/padel.png',
  'squash-gear': '/images/sports/squash.png',
  'shoes-accessories': '/images/sports/ProCourtSports.png',
};

const SPORT_IMAGE_MAP: Record<string, string> = {
  tennis: '/images/sports/tennis.png',
  padel: '/images/sports/padel.png',
  squash: '/images/sports/squash.png',
};

export class MediaService extends BaseService {
  async resolveProductGallery(
    productId: string,
  ): Promise<ProductGalleryResult> {
    const mediaRecords = await this.db.productMedia.findMany({
      where: {
        productId,
        product: {
          status: RecordStatus.ACTIVE,
        },
        media: {
          status: RecordStatus.ACTIVE,
        },
      },
      include: {
        media: true,
      },
      orderBy: [
        {
          isPrimary: 'desc',
        },
        {
          displayOrder: 'asc',
        },
      ],
    });

    const fallbackImage: MediaResult = {
      url: PRODUCT_PLACEHOLDER_IMAGE,
      altText: 'Product image placeholder',
    };

    if (mediaRecords.length === 0) {
      return {
        primaryImage: fallbackImage,
        images: [fallbackImage],
      };
    }

    const images = mediaRecords.map((record) => ({
      url: record.media.url,
      altText: record.media.altText?.trim() || 'Product image',
    }));

    const primaryRecord = mediaRecords.find((record) => (
      record.isPrimary ||
      record.mediaRole === MediaRole.PRIMARY ||
      record.mediaRole === MediaRole.HERO
    ));

    return {
      primaryImage: primaryRecord
        ? {
          url: primaryRecord.media.url,
          altText: primaryRecord.media.altText?.trim() || 'Product image',
        }
        : images[0],
      images,
    };
  }

  async resolveProductImages(
    productIds: string[],
  ): Promise<Record<string, MediaResult>> {
    if (productIds.length === 0) {
      return {};
    }

    const mediaRecords = await this.db.productMedia.findMany({
      where: {
        productId: {
          in: productIds,
        },
        product: {
          status: RecordStatus.ACTIVE,
        },
        media: {
          status: RecordStatus.ACTIVE,
        },
      },
      include: {
        media: true,
      },
      orderBy: [
        {
          isPrimary: 'desc',
        },
        {
          displayOrder: 'asc',
        },
      ],
    });

    const resolved: Record<string, MediaResult> = {};

    for (const record of mediaRecords) {
      if (resolved[record.productId]) {
        continue;
      }

      const preferred =
        record.isPrimary ||
        record.mediaRole === MediaRole.PRIMARY ||
        record.mediaRole === MediaRole.HERO;

      if (!preferred && mediaRecords.some((entry) => (
        entry.productId === record.productId && (
          entry.isPrimary ||
          entry.mediaRole === MediaRole.PRIMARY ||
          entry.mediaRole === MediaRole.HERO
        )
      ))) {
        continue;
      }

      resolved[record.productId] = {
        url: record.media.url,
        altText: record.media.altText?.trim() || 'Product image',
      };
    }

    for (const productId of productIds) {
      if (!resolved[productId]) {
        resolved[productId] = {
          url: PRODUCT_PLACEHOLDER_IMAGE,
          altText: 'Product image placeholder',
        };
      }
    }

    return resolved;
  }

  resolveBrandLogo(
    brandName: string,
    logoUrl?: string | null,
  ): MediaResult {
    return {
      url: logoUrl?.trim() || BRAND_PLACEHOLDER_IMAGE,
      altText: `${brandName} logo`,
    };
  }

  resolveCategoryImage(
    categoryName: string,
    categorySlug: string,
  ): MediaResult {
    return {
      url: CATEGORY_IMAGE_MAP[categorySlug] ?? CATEGORY_PLACEHOLDER_IMAGE,
      altText: `${categoryName} category image`,
    };
  }

  resolveSportImage(
    sportName: string,
    sportSlug: string,
  ): MediaResult {
    return {
      url: SPORT_IMAGE_MAP[sportSlug] ?? SPORT_PLACEHOLDER_IMAGE,
      altText: `${sportName} sport image`,
    };
  }
}

export const mediaService =
  new MediaService();
