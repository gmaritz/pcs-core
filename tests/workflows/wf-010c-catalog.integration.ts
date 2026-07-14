import {
  MediaRole,
  RecordStatus,
} from '@prisma/client';

import {
  prisma,
} from '../../src/infrastructure/database';
import {
  CatalogFacade,
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

type Fixture = {
  sport: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
  };
  brands: {
    wilson: {
      name: string;
      slug: string;
    };
    head: {
      name: string;
      slug: string;
    };
  };
  products: {
    blade: {
      code: string;
      slug: string;
      productId: string;
      variantId: string;
    };
    clash: {
      code: string;
      slug: string;
      productId: string;
      variantId: string;
    };
    speed: {
      code: string;
      slug: string;
      productId: string;
      variantId: string;
    };
  };
};

async function createFixture(
  runTag: string,
): Promise<Fixture> {
  const sport = await prisma.sport.create({
    data: {
      name: `WF010C Tennis ${runTag}`,
      code: `WF010C-SP-${runTag}`,
      slug: `wf010c-tennis-${runTag}`,
      status: RecordStatus.ACTIVE,
    },
  });

  const category = await prisma.category.create({
    data: {
      name: `WF010C Racquets ${runTag}`,
      code: `WF010C-CAT-${runTag}`,
      slug: `wf010c-racquets-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const wilson = await prisma.brand.create({
    data: {
      name: `WF010C Wilson ${runTag}`,
      code: `WF010C-BRAND-WILSON-${runTag}`,
      slug: `wf010c-wilson-${runTag}`,
      sportId: sport.id,
      logoUrl: '/images/brands/wilson.png',
      status: RecordStatus.ACTIVE,
    },
  });

  const head = await prisma.brand.create({
    data: {
      name: `WF010C Head ${runTag}`,
      code: `WF010C-BRAND-HEAD-${runTag}`,
      slug: `wf010c-head-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const bladeProduct = await prisma.product.create({
    data: {
      name: `WF010C Blade ${runTag}`,
      code: `WF010C-PROD-BLADE-${runTag}`,
      slug: `wf010c-blade-${runTag}`,
      shortDescription: 'Blade fixture',
      sportId: sport.id,
      categoryId: category.id,
      brandId: wilson.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const clashProduct = await prisma.product.create({
    data: {
      name: `WF010C Clash ${runTag}`,
      code: `WF010C-PROD-CLASH-${runTag}`,
      slug: `wf010c-clash-${runTag}`,
      shortDescription: 'Clash fixture',
      sportId: sport.id,
      categoryId: category.id,
      brandId: wilson.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const speedProduct = await prisma.product.create({
    data: {
      name: `WF010C Speed ${runTag}`,
      code: `WF010C-PROD-SPEED-${runTag}`,
      slug: `wf010c-speed-${runTag}`,
      shortDescription: 'Speed fixture',
      sportId: sport.id,
      categoryId: category.id,
      brandId: head.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const bladeVariant = await prisma.productVariant.create({
    data: {
      name: `WF010C Blade 98 ${runTag}`,
      sku: `WF010C-SKU-BLADE-${runTag}`,
      slug: `wf010c-sku-blade-${runTag}`,
      productId: bladeProduct.id,
      sellingPrice: 3899,
      isDefault: true,
      status: RecordStatus.ACTIVE,
    },
  });

  const clashVariant = await prisma.productVariant.create({
    data: {
      name: `WF010C Clash 100 ${runTag}`,
      sku: `WF010C-SKU-CLASH-${runTag}`,
      slug: `wf010c-sku-clash-${runTag}`,
      productId: clashProduct.id,
      sellingPrice: 4199,
      isDefault: true,
      status: RecordStatus.ACTIVE,
    },
  });

  const speedVariant = await prisma.productVariant.create({
    data: {
      name: `WF010C Speed MP ${runTag}`,
      sku: `WF010C-SKU-SPEED-${runTag}`,
      slug: `wf010c-sku-speed-${runTag}`,
      productId: speedProduct.id,
      sellingPrice: 4499,
      isDefault: true,
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.inventory.createMany({
    data: [
      {
        productVariantId: bladeVariant.id,
        quantityOnHand: 12,
        quantityReserved: 1,
      },
      {
        productVariantId: clashVariant.id,
        quantityOnHand: 6,
        quantityReserved: 0,
      },
      {
        productVariantId: speedVariant.id,
        quantityOnHand: 0,
        quantityReserved: 0,
      },
    ],
  });

  const bladeImage = await prisma.media.create({
    data: {
      filename: `wf010c-blade-${runTag}.jpg`,
      mimeType: 'image/jpeg',
      extension: 'jpg',
      url: '/images/products/wf010c-blade.jpg',
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.productMedia.create({
    data: {
      productId: bladeProduct.id,
      mediaId: bladeImage.id,
      mediaRole: MediaRole.PRIMARY,
      isPrimary: true,
    },
  });

  return {
    sport: {
      name: sport.name,
      slug: sport.slug,
    },
    category: {
      name: category.name,
      slug: category.slug,
    },
    brands: {
      wilson: {
        name: wilson.name,
        slug: wilson.slug,
      },
      head: {
        name: head.name,
        slug: head.slug,
      },
    },
    products: {
      blade: {
        code: bladeProduct.code,
        slug: bladeProduct.slug,
        productId: bladeProduct.id,
        variantId: bladeVariant.id,
      },
      clash: {
        code: clashProduct.code,
        slug: clashProduct.slug,
        productId: clashProduct.id,
        variantId: clashVariant.id,
      },
      speed: {
        code: speedProduct.code,
        slug: speedProduct.slug,
        productId: speedProduct.id,
        variantId: speedVariant.id,
      },
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
  const locals: Record<string, unknown> = {};

  return {
    locals,
    render: (
      view: string,
      payload: Record<string, unknown>,
    ) => {
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
    throw new Error('DATABASE_URL is required to run WF-010C integration checks.');
  }

  const runTag = Date.now().toString();
  const facade = new CatalogFacade();

  try {
    console.log('WF-010C Integration: setup');
    const fixture = await createFixture(runTag);

    console.log('WF-010C Integration: test 1 search by keyword');
    const searchResult = await facade.buildCatalogPageViewModel({
      q: 'wilson',
    });

    assert(searchResult.catalog.products.length >= 2, 'Keyword search should return Wilson products.');
    assert(
      searchResult.catalog.products.every((item) => (
        item.brandName.toLowerCase().includes('wilson')
      )),
      'Keyword search should only return Wilson product cards.',
    );

    console.log('WF-010C Integration: test 2 brand filter');
    const brandResult = await facade.buildCatalogPageViewModel({
      brand: fixture.brands.head.slug,
    });

    assert(brandResult.catalog.products.length === 1, 'Brand filter should narrow results to one product.');
    assert(brandResult.catalog.products[0].brandName === fixture.brands.head.name, 'Brand filter should return Head item.');

    console.log('WF-010C Integration: test 3 price range');
    const priceRangeResult = await facade.buildCatalogPageViewModel({
      minPrice: '4000',
      maxPrice: '4300',
    });

    assert(priceRangeResult.catalog.products.length === 1, 'Price range should return one product.');
    assert(priceRangeResult.catalog.products[0].productName.includes('Clash'), 'Price range should return Clash product.');

    console.log('WF-010C Integration: test 4 pagination and sorting');
    const pageOne = await facade.buildCatalogPageViewModel({
      page: '1',
      pageSize: '1',
      sort: 'name-asc',
    });

    const pageTwo = await facade.buildCatalogPageViewModel({
      page: '2',
      pageSize: '1',
      sort: 'name-asc',
    });

    assert(pageOne.catalog.pagination.totalPages >= 3, 'Pagination should produce multiple pages.');
    assert(pageTwo.catalog.products.length === 1, 'Page two should contain one product item.');
    assert(
      pageOne.catalog.products[0].productId !== pageTwo.catalog.products[0].productId,
      'Pagination should return distinct products per page.',
    );

    console.log('WF-010C Integration: test 5 deactivate product');
    await prisma.product.update({
      where: {
        id: fixture.products.blade.productId,
      },
      data: {
        status: RecordStatus.INACTIVE,
      },
    });

    const afterDeactivate = await facade.buildCatalogPageViewModel({
      q: 'Blade',
    });

    assert(afterDeactivate.catalog.products.length === 0, 'Inactive products must be excluded from catalog search.');

    await prisma.product.update({
      where: {
        id: fixture.products.blade.productId,
      },
      data: {
        status: RecordStatus.ACTIVE,
      },
    });

    console.log('WF-010C Integration: test 6 missing product image uses placeholder');
    const placeholderResult = await facade.buildCatalogPageViewModel({
      q: 'Speed',
    });

    assert(placeholderResult.catalog.products.length === 1, 'Speed search should return one product.');
    assert(
      placeholderResult.catalog.products[0].imageUrl === '/images/products/wilson-clash.jpeg',
      'Missing product image should use catalog placeholder.',
    );

    console.log('WF-010C Integration: test 7 selling price updates are reflected');
    await prisma.productVariant.update({
      where: {
        id: fixture.products.clash.variantId,
      },
      data: {
        sellingPrice: 4999,
      },
    });

    const priceUpdateResult = await facade.buildCatalogPageViewModel({
      q: 'Clash',
    });

    assert(priceUpdateResult.catalog.products.length === 1, 'Clash query should return one product.');
    assert(
      priceUpdateResult.catalog.products[0].formattedPrice === 'R4,999',
      'Updated selling price should be reflected in catalog card.',
    );

    console.log('WF-010C Integration: test 8 metadata generation and controller rendering');
    const metadataResult = await facade.buildCatalogPageViewModel({});

    assert(
      metadataResult.metadata.title === 'Shop Premium Court Sports Equipment | Pro Court Sports',
      'Catalog metadata title should be generated by PageMetadataService.',
    );
    assert(
      metadataResult.metadata.description.includes('Browse premium tennis'),
      'Catalog metadata description should be generated.',
    );
    assert(metadataResult.metadata.canonicalUrl === '/shop', 'Catalog canonical URL should be /shop.');

    const controller = new StorefrontController();
    const req = {
      path: '/shop',
      query: {},
      params: {},
    } as any;
    const res = createMockResponse() as any;

    await controller.renderCatalog(req, res);

    assert(res.locals.view === 'storefront/catalog', 'Catalog controller should render storefront/catalog.');
    assert(Boolean(res.locals.payload), 'Catalog controller should provide payload to the template.');

    console.log('WF-010C Integration: pass');
  } finally {
    console.log('WF-010C Integration: cleanup');
    await cleanup(runTag);
    await prisma.$disconnect();
  }
}

void run().catch((error) => {
  console.error('WF-010C Integration: fail');
  console.error(error);
  process.exitCode = 1;
});
