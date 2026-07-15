"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = exports.MediaService = void 0;
const client_1 = require("@prisma/client");
const BaseService_1 = require("../../shared/services/BaseService");
const PRODUCT_PLACEHOLDER_IMAGE = '/images/products/wilson-clash.jpeg';
const BRAND_PLACEHOLDER_IMAGE = '/images/sports/ProCourtSports.png';
const CATEGORY_PLACEHOLDER_IMAGE = '/images/sports/ProCourtSports.png';
const SPORT_PLACEHOLDER_IMAGE = '/images/sports/ProCourtSports.png';
const CATEGORY_IMAGE_MAP = {
    'tennis-racquets': '/images/sports/tennis.png',
    'padel-racquets': '/images/sports/padel.png',
    'squash-gear': '/images/sports/squash.png',
    'shoes-accessories': '/images/sports/ProCourtSports.png',
};
const SPORT_IMAGE_MAP = {
    tennis: '/images/sports/tennis.png',
    padel: '/images/sports/padel.png',
    squash: '/images/sports/squash.png',
};
class MediaService extends BaseService_1.BaseService {
    async resolveProductGallery(productId) {
        const mediaRecords = await this.db.productMedia.findMany({
            where: {
                productId,
                product: {
                    status: client_1.RecordStatus.ACTIVE,
                },
                media: {
                    status: client_1.RecordStatus.ACTIVE,
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
        const fallbackImage = {
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
        const primaryRecord = mediaRecords.find((record) => (record.isPrimary ||
            record.mediaRole === client_1.MediaRole.PRIMARY ||
            record.mediaRole === client_1.MediaRole.HERO));
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
    async resolveProductImages(productIds) {
        if (productIds.length === 0) {
            return {};
        }
        const mediaRecords = await this.db.productMedia.findMany({
            where: {
                productId: {
                    in: productIds,
                },
                product: {
                    status: client_1.RecordStatus.ACTIVE,
                },
                media: {
                    status: client_1.RecordStatus.ACTIVE,
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
        const resolved = {};
        for (const record of mediaRecords) {
            if (resolved[record.productId]) {
                continue;
            }
            const preferred = record.isPrimary ||
                record.mediaRole === client_1.MediaRole.PRIMARY ||
                record.mediaRole === client_1.MediaRole.HERO;
            if (!preferred && mediaRecords.some((entry) => (entry.productId === record.productId && (entry.isPrimary ||
                entry.mediaRole === client_1.MediaRole.PRIMARY ||
                entry.mediaRole === client_1.MediaRole.HERO)))) {
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
    resolveBrandLogo(brandName, logoUrl) {
        return {
            url: logoUrl?.trim() || BRAND_PLACEHOLDER_IMAGE,
            altText: `${brandName} logo`,
        };
    }
    resolveCategoryImage(categoryName, categorySlug) {
        return {
            url: CATEGORY_IMAGE_MAP[categorySlug] ?? CATEGORY_PLACEHOLDER_IMAGE,
            altText: `${categoryName} category image`,
        };
    }
    resolveSportImage(sportName, sportSlug) {
        return {
            url: SPORT_IMAGE_MAP[sportSlug] ?? SPORT_PLACEHOLDER_IMAGE,
            altText: `${sportName} sport image`,
        };
    }
}
exports.MediaService = MediaService;
exports.mediaService = new MediaService();
