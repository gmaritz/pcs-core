import {
  RecordStatus,
} from '@prisma/client';

import {
  storefrontFacade,
} from '../../src/modules/storefront/facades';
import {
  StorefrontController,
} from '../../src/modules/storefront/controllers';
import {
  prisma,
} from '../../src/infrastructure/database';

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function createFixture(
  runTag: string,
): Promise<void> {
  const sport = await prisma.sport.create({
    data: {
      name: `WF010B Tennis ${runTag}`,
      code: `WF010B-SP-${runTag}`,
      slug: `wf010b-sport-${runTag}`,
      status: RecordStatus.ACTIVE,
    },
  });

  const category = await prisma.category.create({
    data: {
      name: `WF010B Racquets ${runTag}`,
      code: `WF010B-CAT-${runTag}`,
      slug: `wf010b-category-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const brand = await prisma.brand.create({
    data: {
      name: `WF010B Brand ${runTag}`,
      code: `WF010B-BRAND-${runTag}`,
      slug: `wf010b-brand-${runTag}`,
      sportId: sport.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const product = await prisma.product.create({
    data: {
      name: `WF010B Product ${runTag}`,
      code: `WF010B-PROD-${runTag}`,
      slug: `wf010b-product-${runTag}`,
      shortDescription: 'WF-010B featured product fixture',
      isFeatured: true,
      sportId: sport.id,
      categoryId: category.id,
      brandId: brand.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const variant = await prisma.productVariant.create({
    data: {
      name: `WF010B Variant ${runTag}`,
      sku: `WF010B-SKU-${runTag}`,
      slug: `wf010b-variant-${runTag}`,
      productId: product.id,
      sellingPrice: 2599.0,
      isDefault: true,
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.inventory.create({
    data: {
      productVariantId: variant.id,
      quantityOnHand: 6,
      quantityReserved: 1,
    },
  });
}

async function cleanup(
  runTag: string,
): Promise<void> {
  await prisma.inventory.deleteMany({
    where: {
      productVariant: {
        sku: {
          startsWith: `WF010B-SKU-${runTag}`,
        },
      },
    },
  });

  await prisma.productVariant.deleteMany({
    where: {
      sku: {
        startsWith: `WF010B-SKU-${runTag}`,
      },
    },
  });

  await prisma.product.deleteMany({
    where: {
      code: {
        startsWith: `WF010B-PROD-${runTag}`,
      },
    },
  });

  await prisma.brand.deleteMany({
    where: {
      code: {
        startsWith: `WF010B-BRAND-${runTag}`,
      },
    },
  });

  await prisma.category.deleteMany({
    where: {
      code: {
        startsWith: `WF010B-CAT-${runTag}`,
      },
    },
  });

  await prisma.sport.deleteMany({
    where: {
      code: {
        startsWith: `WF010B-SP-${runTag}`,
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
  };
}

async function run(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run WF-010B integration checks.');
  }

  const runTag = Date.now().toString();

  try {
    console.log('WF-010B Integration: setup');
    await createFixture(runTag);

    console.log('WF-010B Integration: home facade loads data');
    const home = await storefrontFacade.buildHomeViewModel();

    assert(home.heroStatistics.items.length === 4, 'Hero statistics should expose four summary metrics.');
    assert(home.featuredProducts.items.length > 0, 'Featured products should load at least one item.');
    assert(home.featuredProducts.items.length <= 8, 'Featured products should be limited to eight items.');
    assert(home.brands.items.length > 0, 'Brands should load at least one active item.');
    assert(home.categories.items.length > 0, 'Categories should load at least one active item.');
    assert(home.sports.items.length > 0, 'Sports should load at least one active item.');

    console.log('WF-010B Integration: homepage controller renders');
    const controller = new StorefrontController();
    const req = {
      path: '/',
      query: {},
      params: {},
    } as any;
    const res = createMockResponse() as any;

    await controller.renderHome(req, res);

    assert(res.locals.view === 'storefront/home', 'Home controller should render storefront/home.');
    assert(Boolean(res.locals.payload), 'Home controller should pass payload to the view.');

    console.log('WF-010B Integration: deactivate product removes featured record');
    await prisma.product.updateMany({
      where: {
        code: {
          startsWith: `WF010B-PROD-${runTag}`,
        },
      },
      data: {
        status: RecordStatus.INACTIVE,
      },
    });

    const afterDeactivateProduct = await storefrontFacade.buildHomeViewModel();
    const productStillVisible = afterDeactivateProduct.featuredProducts.items.some(
      (item) => item.name.includes(`WF010B Variant ${runTag}`),
    );

    assert(!productStillVisible, 'Inactive products must not appear in featured products.');

    console.log('WF-010B Integration: deactivate category removes category record');
    await prisma.category.updateMany({
      where: {
        code: {
          startsWith: `WF010B-CAT-${runTag}`,
        },
      },
      data: {
        status: RecordStatus.INACTIVE,
      },
    });

    const afterDeactivateCategory = await storefrontFacade.buildHomeViewModel();
    const categoryStillVisible = afterDeactivateCategory.categories.items.some(
      (item) => item.name.includes(`WF010B Racquets ${runTag}`),
    );

    assert(!categoryStillVisible, 'Inactive categories must not appear on homepage categories.');

    console.log('WF-010B Integration: pass');
  } finally {
    console.log('WF-010B Integration: cleanup');
    await cleanup(runTag);
    await prisma.$disconnect();
  }
}

void run().catch((error) => {
  console.error('WF-010B Integration: fail');
  console.error(error);
  process.exitCode = 1;
});
