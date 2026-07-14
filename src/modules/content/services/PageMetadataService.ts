import {
  PageMetadata,
} from '../types';

const CATALOG_TITLE =
  'Shop Premium Court Sports Equipment | Pro Court Sports';
const CATALOG_DESCRIPTION =
  'Browse premium tennis, padel, squash and badminton equipment from leading international brands.';
const CATALOG_CANONICAL_URL = '/shop';

export class PageMetadataService {
  buildCatalogPageMetadata(): PageMetadata {
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
}

export const pageMetadataService =
  new PageMetadataService();
