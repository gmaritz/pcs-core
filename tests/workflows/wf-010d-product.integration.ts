import {
  MediaRole,
  RecordStatus,
} from '@prisma/client';

import {
  prisma,
} from '../../src/infrastructure/database';
import {
  recommendationService,
} from '../../src/modules/recommendation';
import {
  ProductFacade,
} from '../../src/modules/storefront/facades';
import {
  StorefrontController,
} from '../../src/modules/storefront/controllers';

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(message);
  }
}

type ProductSeed = {
  id: string;
  slug: string;
  variantId: string;
};

type Fixture = {
  sport: {
    id: string;
    name: string;
    slug: string;
  };
  categories: {
    racquets: {
      id: string;
      slug: string;
    };
    shoes: {
      id: string;
      slug: string;
    };
  };
  brands: {
    wilson: {
      id: string;
      name: string;
    };
    head: {
      id: string;
      name: string;
    };
    babolat: {
      id: string;
      name: string;
    };
  };
  products: {
    target: ProductSeed;
    noMedia: ProductSeed;
    categoryMatchInStock: ProductSeed;
    categoryMatchOutOfStock: ProductSeed;
    brandMatch: ProductSeed;
    sportMatchOne: ProductSeed;
    sportMatchTwo: ProductSeed;
  };
};

async function createProductSeed(input: {
  runTag: string;
  codePrefix: string;
  name: string;
  slug: string;
  shortDescription: string;
  sportId: string;
  categoryId: string;
  brandId: string;
  sellingPrice: number;
  quantityOnHand: number;
  quantityReserved?: number;
  includeMedia?: boolean;
}): Promise<ProductSeed> {
  const product = await prisma.product.create({
    data: {
      name: input.name,
      code: `${input.codePrefix}-${input.runTag}`,
      slug: `${input.slug}-${input.runTag}`,
      shortDescription: input.shortDescription,
      sportId: input.sportId,
      categoryId: input.categoryId,
      brandId: input.brandId,
      status: RecordStatus.ACTIVE,
    },
  });

  const variant = await prisma.productVariant.create({
    data: {
      name: `${input.name} Default`,
      sku: `${input.codePrefix}-SKU-${input.runTag}`,
      slug: `${input.slug}-sku-${input.runTag}`,
      productId: product.id,
      sellingPrice: input.sellingPrice,
      isDefault: true,
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.inventory.create({
    data: {
      productVariantId: variant.id,
      quantityOnHand: input.quantityOnHand,
      quantityReserved: input.quantityReserved ?? 0,
    },
  });

  if (input.includeMedia) {
    const media = await prisma.media.create({
      data: {
        filename: `${input.slug}-${input.runTag}.jpg`,
        mimeType: 'image/jpeg',
        extension: 'jpg',
        url: `/images/products/${input.slug}.jpg`,
        altText: `${input.name} image`,
        status: RecordStatus.ACTIVE,
      },
    });

    await prisma.productMedia.create({
      data: {
        productId: product.id,
        mediaId: media.id,
        mediaRole: MediaRole.PRIMARY,
        isPrimary: true,
      },
    });
  }

  return {
    id: product.id,
    slug: product.slug,
    variantId: variant.id,
  };
}

async function createFixture(
  runTag: string,
): Promise<Fixture> {
  const sport = await prisma.sport.create({
    data: {
      name: `WF010D Tennis ${runTag}`,
      code: `WF010D-SP-${runTag}`,
      slug: `wf010d-tennis-${runTag}`,
      status: RecordStatus.ACTIVE,
    },
  });

  const racquets = await prisma.category.create({
    data: {
      name: `WF010D Racquets ${runTag}`,
      code: `WF010D-CAT-RAC-${runTag}`,
      slug: `wf010d-racquets-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const shoes = await prisma.category.create({
    data: {
      name: `WF010D Shoes ${runTag}`,
      code: `WF010D-CAT-SHOE-${runTag}`,
      slug: `wf010d-shoes-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const wilson = await prisma.brand.create({
    data: {
      name: `WF010D Wilson ${runTag}`,
      code: `WF010D-BRAND-WILSON-${runTag}`,
      slug: `wf010d-wilson-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const head = await prisma.brand.create({
    data: {
      name: `WF010D Head ${runTag}`,
      code: `WF010D-BRAND-HEAD-${runTag}`,
      slug: `wf010d-head-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const babolat = await prisma.brand.create({
    data: {
      name: `WF010D Babolat ${runTag}`,
      code: `WF010D-BRAND-BABOLAT-${runTag}`,
      slug: `wf010d-babolat-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const target = await createProductSeed({
    runTag,
    codePrefix: 'WF010D-TARGET',
    name: `WF010D Blade ${runTag}`,
    slug: 'wf010d-target-product',
    shortDescription: 'WF-010D target product description',
    sportId: sport.id,
    categoryId: racquets.id,
    brandId: wilson.id,
    sellingPrice: 3899,
    quantityOnHand: 11,
    quantityReserved: 1,
    includeMedia: true,
  });

  await prisma.specification.create({
    data: {
      name: `Grip Size ${runTag}`,
      code: `WF010D-SPEC-GRIP-${runTag}`,
      slug: `wf010d-spec-grip-${runTag}`,
      dataType: 'TEXT',
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  }).then(async (specification) => {
    await prisma.productSpecification.create({
      data: {
        productId: target.id,
        specificationId: specification.id,
        value: '4 3/8',
      },
    });
  });

  const noMedia = await createProductSeed({
    runTag,
    codePrefix: 'WF010D-NOMEDIA',
    name: `WF010D No Media ${runTag}`,
    slug: 'wf010d-no-media',
    shortDescription: 'WF-010D no media product',
    sportId: sport.id,
    categoryId: shoes.id,
    brandId: head.id,
    sellingPrice: 2999,
    quantityOnHand: 5,
  });

  const categoryMatchInStock = await createProductSeed({
    runTag,
    codePrefix: 'WF010D-CAT-A',
    name: `A Category Match ${runTag}`,
    slug: 'wf010d-category-a',
    shortDescription: 'Category recommendation',
    sportId: sport.id,
    categoryId: racquets.id,
    brandId: head.id,
    sellingPrice: 3599,
    quantityOnHand: 8,
  });

  const categoryMatchOutOfStock = await createProductSeed({
    runTag,
    codePrefix: 'WF010D-CAT-B',
    name: `B Category Out ${runTag}`,
    slug: 'wf010d-category-b',
    shortDescription: 'Category recommendation out of stock',
    sportId: sport.id,
    categoryId: racquets.id,
    brandId: babolat.id,
    sellingPrice: 3399,
    quantityOnHand: 0,
  });

  const brandMatch = await createProductSeed({
    runTag,
    codePrefix: 'WF010D-BRAND',
    name: `C Brand Match ${runTag}`,
    slug: 'wf010d-brand-match',
    shortDescription: 'Brand recommendation',
    sportId: sport.id,
    categoryId: shoes.id,
    brandId: wilson.id,
    sellingPrice: 1999,
    quantityOnHand: 9,
  });

  const sportMatchOne = await createProductSeed({
    runTag,
    codePrefix: 'WF010D-SP-ONE',
    name: `D Sport Match ${runTag}`,
    slug: 'wf010d-sport-match-one',
    shortDescription: 'Sport recommendation one',
    sportId: sport.id,
    categoryId: shoes.id,
    brandId: head.id,
    sellingPrice: 1499,
    quantityOnHand: 4,
  });

  const sportMatchTwo = await createProductSeed({
    runTag,
    codePrefix: 'WF010D-SP-TWO',
    name: `E Sport Match ${runTag}`,
    slug: 'wf010d-sport-match-two',
    shortDescription: 'Sport recommendation two',
    sportId: sport.id,
    categoryId: shoes.id,
    brandId: babolat.id,
    sellingPrice: 1599,
    quantityOnHand: 3,
  });

  return {
    sport: {
      id: sport.id,
      name: sport.name,
      slug: sport.slug,
    },
    categories: {
      racquets: {
        id: racquets.id,
        slug: racquets.slug,
      },
      shoes: {
        id: shoes.id,
        slug: shoes.slug,
      },
    },
    brands: {
      wilson: {
        id: wilson.id,
        name: wilson.name,
      },
      head: {
        id: head.id,
        name: head.name,
      },
      babolat: {
        id: babolat.id,
        name: babolat.name,
      },
    },
    products: {
      target,
      noMedia,
      categoryMatchInStock,
      categoryMatchOutOfStock,
      brandMatch,
      sportMatchOne,
      sportMatchTwo,
    },
  };
}

async function cleanup(
  runTag: string,
): Promise<void> {
  await prisma.productMedia.deleteMany({
    where: {
      product: {
        code: {
          endsWith: `-${runTag}`,
        },
      },
    },
  });

  await prisma.productSpecification.deleteMany({
    where: {
      product: {
        code: {
          endsWith: `-${runTag}`,
        },
      },
    },
  });

  await prisma.specification.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.media.deleteMany({
    where: {
      filename: {
        contains: runTag,
      },
    },
  });

  await prisma.inventory.deleteMany({
    where: {
      productVariant: {
        sku: {
          endsWith: `-${runTag}`,
        },
      },
    },
  });

  await prisma.productVariant.deleteMany({
    where: {
      sku: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.product.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.brand.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.category.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });

  await prisma.sport.deleteMany({
    where: {
      code: {
        endsWith: `-${runTag}`,
      },
    },
  });
}

function createMockResponse() {
  const locals: Record<string, unknown> = {
    statusCode: 200,
  };

  return {
    locals,
    status: (code: number) => {
      locals.statusCode = code;
      return {
        render: (view: string, payload: Record<string, unknown>) => {
          locals.view = view;
          locals.payload = payload;
        },
      };
    },
    render: (view: string, payload: Record<string, unknown>) => {
      locals.view = view;
      locals.payload = payload;
    },
    redirect: (url: string) => {
      locals.redirectUrl = url;
    },
  };
}

async function run(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run WF-010D integration checks.');
  }

  const runTag = Date.now().toString();
  const facade = new ProductFacade();

  try {
    console.log('WF-010D Integration: setup');
    const fixture = await createFixture(runTag);

    console.log('WF-010D Integration: test 1 valid product renders complete view model');
    const productPage = await facade.buildProductPageViewModel(
      fixture.products.target.slug,
    );

    assert(Boolean(productPage), 'Target product should resolve product page view model.');
    assert(productPage?.product.name.includes('Blade'), 'Product detail should include the product name.');
    assert(productPage?.product.gallery.images.length === 1, 'Gallery should include the primary image.');
    assert(productPage?.product.specifications.length === 1, 'Specifications should include dynamic product specs.');
    assert(productPage?.product.availabilityLabel === 'In Stock', 'Availability should be in stock for target product.');
    assert(productPage?.product.breadcrumbs.length === 5, 'Breadcrumbs should include Home > Shop > Sport > Category > Product.');

    console.log('WF-010D Integration: test 2 missing image uses placeholder');
    const noMediaPage = await facade.buildProductPageViewModel(
      fixture.products.noMedia.slug,
    );

    assert(Boolean(noMediaPage), 'No-media product should still resolve.');
    assert(
      noMediaPage?.product.gallery.primaryImage.url === '/images/products/wilson-clash.jpeg',
      'Missing product media should use placeholder image.',
    );

    console.log('WF-010D Integration: test 3 deactivate product returns 404 path');
    await prisma.product.update({
      where: {
        id: fixture.products.target.id,
      },
      data: {
        status: RecordStatus.INACTIVE,
      },
    });

    const inactivePage = await facade.buildProductPageViewModel(
      fixture.products.target.slug,
    );
    assert(inactivePage === null, 'Inactive products must not resolve for storefront detail page.');

    const controller = new StorefrontController();
    const req = {
      path: `/product/${fixture.products.target.slug}`,
      params: {
        slug: fixture.products.target.slug,
      },
      query: {},
    } as any;
    const res = createMockResponse() as any;

    await controller.renderProduct(req, res);

    assert(res.locals.statusCode === 404, 'Inactive product should render 404 response status.');
    assert(res.locals.view === 'storefront/error', 'Inactive product should render storefront error view.');

    await prisma.product.update({
      where: {
        id: fixture.products.target.id,
      },
      data: {
        status: RecordStatus.ACTIVE,
      },
    });

    console.log('WF-010D Integration: test 4 selling price updates reflected');
    await prisma.productVariant.update({
      where: {
        id: fixture.products.target.variantId,
      },
      data: {
        sellingPrice: 4999,
      },
    });

    const updatedPricePage = await facade.buildProductPageViewModel(
      fixture.products.target.slug,
    );

    assert(
      updatedPricePage?.product.formattedPrice === 'R4,999',
      'Updated selling price should be reflected in product detail page.',
    );

    console.log('WF-010D Integration: test 5 recommendation service strategy and limits');
    const recommendations = await recommendationService.resolveRelatedProducts({
      productId: fixture.products.target.id,
      categoryId: fixture.categories.racquets.id,
      brandId: fixture.brands.wilson.id,
      sportId: fixture.sport.id,
      limit: 4,
    });

    assert(recommendations.length === 4, 'Recommendation service should return maximum of 4 products.');
    assert(
      recommendations.every((item) => item.productId !== fixture.products.target.id),
      'Recommendation service must exclude the current product.',
    );

    const categoryIds = new Set([
      fixture.products.categoryMatchInStock.id,
      fixture.products.categoryMatchOutOfStock.id,
      fixture.products.noMedia.id,
    ]);

    assert(categoryIds.has(recommendations[0].productId), 'First recommendation should prioritize category matches.');

    const brandIds = new Set([
      fixture.products.brandMatch.id,
    ]);

    assert(
      recommendations.some((item) => brandIds.has(item.productId)),
      'Recommendation results should include brand-priority matches.',
    );

    const sportOnlyIds = new Set([
      fixture.products.sportMatchOne.id,
      fixture.products.sportMatchTwo.id,
    ]);

    assert(
      recommendations.some((item) => sportOnlyIds.has(item.productId)),
      'Recommendation results should include sport-priority matches when slots remain.',
    );

    console.log('WF-010D Integration: test 6 metadata and controller payload');
    const metadataPage = await facade.buildProductPageViewModel(
      fixture.products.target.slug,
    );

    assert(Boolean(metadataPage), 'Target page should be available for metadata test.');
    assert(
      metadataPage?.metadata.title.includes('Pro Court Sports'),
      'Metadata title should include store name.',
    );
    assert(
      metadataPage?.metadata.canonicalUrl === `/product/${fixture.products.target.slug}`,
      'Canonical URL should point at /product/:slug.',
    );
    assert(
      metadataPage?.metadata.openGraph?.image === metadataPage?.product.gallery.primaryImage.url,
      'Open Graph image should use primary product image.',
    );

    const renderReq = {
      path: `/product/${fixture.products.target.slug}`,
      params: {
        slug: fixture.products.target.slug,
      },
      query: {},
    } as any;
    const renderRes = createMockResponse() as any;

    await controller.renderProduct(renderReq, renderRes);

    assert(renderRes.locals.view === 'storefront/product', 'Product controller should render storefront/product.');
    assert(Boolean(renderRes.locals.payload), 'Product controller should provide payload for template rendering.');

    console.log('WF-010D Integration: pass');
  } finally {
    console.log('WF-010D Integration: cleanup');
    await cleanup(runTag);
    await prisma.$disconnect();
  }
}

void run().catch((error) => {
  console.error('WF-010D Integration: fail');
  console.error(error);
  process.exitCode = 1;
});
