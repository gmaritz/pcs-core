import {
  PageMetadata,
} from '../types';

const CATALOG_TITLE =
  'Shop Premium Court Sports Equipment | Pro Court Sports';
const CATALOG_DESCRIPTION =
  'Browse premium tennis, padel, squash and badminton equipment from leading international brands.';
const CATALOG_CANONICAL_URL = '/shop';
const CART_TITLE = 'Your Cart | Pro Court Sports';
const CHECKOUT_TITLE = 'Checkout | Pro Court Sports';
const ACCOUNT_TITLE = 'My Account | Pro Court Sports';

type ProductPageMetadataInput = {
  productName: string;
  brandName: string;
  description?: string;
  slug: string;
  primaryImageUrl: string;
};

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

  buildProductPageMetadata(
    input: ProductPageMetadataInput,
  ): PageMetadata {
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

  buildCartPageMetadata(): PageMetadata {
    return {
      title: CART_TITLE,
      description: 'Review your selected items and continue to checkout.',
      canonicalUrl: '/cart',
      openGraph: {
        title: CART_TITLE,
        description: 'Review your selected items and continue to checkout.',
      },
    };
  }

  buildCheckoutPageMetadata(): PageMetadata {
    return {
      title: CHECKOUT_TITLE,
      description: 'Confirm delivery details and place your Pro Court Sports order.',
      canonicalUrl: '/checkout',
      openGraph: {
        title: CHECKOUT_TITLE,
        description: 'Confirm delivery details and place your Pro Court Sports order.',
      },
    };
  }

  buildOrderConfirmationPageMetadata(
    orderId: string,
    orderNumber: string,
  ): PageMetadata {
    const title = `Order ${orderNumber} | Pro Court Sports`;

    return {
      title,
      description: `Order confirmation for ${orderNumber}.`,
      canonicalUrl: `/order-confirmation/${orderId}`,
      openGraph: {
        title,
        description: `Order confirmation for ${orderNumber}.`,
      },
    };
  }

  buildCustomerAccountPageMetadata(): PageMetadata {
    return {
      title: ACCOUNT_TITLE,
      description: 'View your profile details and order history.',
      canonicalUrl: '/account',
      openGraph: {
        title: ACCOUNT_TITLE,
        description: 'View your profile details and order history.',
      },
    };
  }
}

export const pageMetadataService =
  new PageMetadataService();
