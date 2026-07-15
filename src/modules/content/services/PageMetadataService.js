"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageMetadataService = exports.PageMetadataService = void 0;
const CATALOG_TITLE = 'Shop Premium Court Sports Equipment | Pro Court Sports';
const CATALOG_DESCRIPTION = 'Browse premium tennis, padel, squash and badminton equipment from leading international brands.';
const CATALOG_CANONICAL_URL = '/shop';
class PageMetadataService {
    buildCatalogPageMetadata() {
        return {
            title: CATALOG_TITLE,
            description: CATALOG_DESCRIPTION,
            canonicalUrl: CATALOG_CANONICAL_URL,
            openGraph: {
                title: CATALOG_TITLE,
                description: CATALOG_DESCRIPTION,
            },
        };
    }
    buildProductPageMetadata(input) {
        const title = `${input.brandName} ${input.productName} | Pro Court Sports`;
        const description = input.description?.trim() ||
            `${input.productName} from ${input.brandName}.`;
        const canonicalUrl = `/product/${input.slug}`;
        return {
            title,
            description,
            canonicalUrl,
            openGraph: {
                title,
                description,
                image: input.primaryImageUrl,
            },
        };
    }
}
exports.PageMetadataService = PageMetadataService;
exports.pageMetadataService = new PageMetadataService();
