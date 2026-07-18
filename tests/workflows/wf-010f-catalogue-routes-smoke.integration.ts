import {
  RecordStatus,
} from '@prisma/client';

import {
  prisma,
} from '../../src/infrastructure/database';
import {
  catalogueController,
} from '../../src/modules/storefront/catalogue';

type Fixture = {
  sportId: string;
  categoryId: string;
  brandId: string;
  productCode: string;
  variantSku: string;
};

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(message);
  }
}

function createMockResponse() {
  const locals: Record<string, unknown> = {};

  return {
    locals,
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    render: (
      view: string,
      payload: Record<string, unknown>,
    ) => {
      locals.view = view;
      locals.payload = payload;
    },
  };
}

async function ensureCoreCatalogueEntities(
  runTag: string,
): Promise<Fixture> {
  let tennis = await prisma.sport.findFirst({
    where: {
      slug: 'tennis',
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!tennis) {
    tennis = await prisma.sport.create({
      data: {
        name: 'Tennis',
        code: `WF010F-SP-TENNIS-${runTag}`,
        slug: 'tennis',
        status: RecordStatus.ACTIVE,
      },
      select: {
        id: true,
        slug: true,
      },
    });
  }

  const requiredSports = [
    {
      name: 'Padel',
      slug: 'padel',
      code: `WF010F-SP-PADEL-${runTag}`,
    },
    {
      name: 'Squash',
      slug: 'squash',
      code: `WF010F-SP-SQUASH-${runTag}`,
    },
  ];

  for (const sport of requiredSports) {
    const exists = await prisma.sport.findFirst({
      where: {
        slug: sport.slug,
      },
      select: {
        id: true,
      },
    });

    if (!exists) {
      await prisma.sport.create({
        data: {
          name: sport.name,
          code: sport.code,
          slug: sport.slug,
          status: RecordStatus.ACTIVE,
        },
      });
    }
  }

  let racquets = await prisma.category.findFirst({
    where: {
      slug: 'racquets',
      sportId: tennis.id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!racquets) {
    racquets = await prisma.category.create({
      data: {
        name: 'Racquets',
        code: `WF010F-CAT-RACQUETS-${runTag}`,
        slug: 'racquets',
        sportId: tennis.id,
        status: RecordStatus.ACTIVE,
      },
      select: {
        id: true,
        slug: true,
      },
    });
  }

  let wilson = await prisma.brand.findFirst({
    where: {
      slug: 'wilson',
      sportId: tennis.id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!wilson) {
    wilson = await prisma.brand.create({
      data: {
        name: 'Wilson',
        code: `WF010F-BRAND-WILSON-${runTag}`,
        slug: 'wilson',
        sportId: tennis.id,
        status: RecordStatus.ACTIVE,
      },
      select: {
        id: true,
        slug: true,
      },
    });
  }

  const productCode = `WF010F-PROD-WILSON-${runTag}`;
  const variantSku = `WF010F-SKU-WILSON-${runTag}`;

  const product = await prisma.product.create({
    data: {
      name: `WF010F Wilson Pro Staff ${runTag}`,
      code: productCode,
      slug: `wf010f-wilson-pro-staff-${runTag}`,
      shortDescription: 'WF-010F route smoke fixture product',
      isFeatured: true,
      sportId: tennis.id,
      categoryId: racquets.id,
      brandId: wilson.id,
      status: RecordStatus.ACTIVE,
    },
    select: {
      id: true,
    },
  });

  const variant = await prisma.productVariant.create({
    data: {
      name: `WF010F Wilson Pro Staff Variant ${runTag}`,
      sku: variantSku,
      slug: `wf010f-sku-wilson-${runTag}`,
      productId: product.id,
      sellingPrice: 3599,
      isDefault: true,
      status: RecordStatus.ACTIVE,
    },
    select: {
      id: true,
    },
  });

  await prisma.inventory.create({
    data: {
      productVariantId: variant.id,
      quantityOnHand: 10,
      quantityReserved: 2,
    },
  });

  return {
    sportId: tennis.id,
    categoryId: racquets.id,
    brandId: wilson.id,
    productCode,
    variantSku,
  };
}

async function cleanup(
  runTag: string,
): Promise<void> {
  await prisma.inventory.deleteMany({
    where: {
      productVariant: {
        sku: {
          startsWith: `WF010F-SKU-WILSON-${runTag}`,
        },
      },
    },
  });

  await prisma.productVariant.deleteMany({
    where: {
      sku: {
        startsWith: `WF010F-SKU-WILSON-${runTag}`,
      },
    },
  });

  await prisma.product.deleteMany({
    where: {
      code: {
        startsWith: `WF010F-PROD-WILSON-${runTag}`,
      },
    },
  });

  await prisma.brand.deleteMany({
    where: {
      code: {
        startsWith: `WF010F-BRAND-WILSON-${runTag}`,
      },
    },
  });

  await prisma.category.deleteMany({
    where: {
      code: {
        startsWith: `WF010F-CAT-RACQUETS-${runTag}`,
      },
    },
  });

  await prisma.sport.deleteMany({
    where: {
      code: {
        in: [
          `WF010F-SP-TENNIS-${runTag}`,
          `WF010F-SP-PADEL-${runTag}`,
          `WF010F-SP-SQUASH-${runTag}`,
        ],
      },
    },
  });
}

async function run(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run WF-010F route smoke checks.');
  }

  const runTag = Date.now().toString();

  try {
    console.log('WF-010F Route Smoke: setup');
    await ensureCoreCatalogueEntities(runTag);

    console.log('WF-010F Route Smoke: /shop landing render');
    const landingReq = {
      path: '/shop',
      query: {},
      params: {},
    } as any;
    const landingRes = createMockResponse() as any;

    await catalogueController.renderLanding(landingReq, landingRes);

    assert(landingRes.locals.view === 'catalogue/landing', '/shop should render catalogue/landing.');

    const landingPayload = landingRes.locals.payload as any;
    const landing = landingPayload.catalogue?.landing;

    assert(Boolean(landing), '/shop payload should include landing view model.');
    assert(landing.featuredSports.length > 0, '/shop should display featured sports.');
    assert(landing.featuredCategories.length > 0, '/shop should display featured categories.');
    assert(landing.featuredBrands.length > 0, '/shop should display featured brands.');
    assert(landing.featuredProducts.length > 0, '/shop should display featured products.');

    const visibleSports = landing.featuredSports
      .map((item: { title: string }) => item.title.trim().toLowerCase());

    const allowedSports = new Set([
      'tennis',
      'padel',
      'squash',
    ]);

    assert(visibleSports.includes('tennis'), 'Public storefront should expose Tennis.');
    assert(visibleSports.includes('padel'), 'Public storefront should expose Padel.');
    assert(visibleSports.includes('squash'), 'Public storefront should expose Squash.');

    const disallowedSports = [
      'basketball',
      'badminton',
      'pickleball',
      'netball',
      'volleyball',
    ];

    assert(
      visibleSports.every((sport: string) => allowedSports.has(sport)),
      'Landing featured sports should only include Tennis, Padel, and Squash.',
    );

    assert(
      disallowedSports.every((sport) => !visibleSports.includes(sport)),
      'Landing featured sports should not include Basketball, Badminton, Pickleball, Netball, or Volleyball.',
    );

    console.log('WF-010F Route Smoke: /shop/tennis render');
    const sportReq = {
      path: '/shop/tennis',
      query: {},
      params: {
        sport: 'tennis',
      },
    } as any;
    const sportRes = createMockResponse() as any;

    await catalogueController.renderSport(sportReq, sportRes);

    assert(sportRes.locals.view === 'catalogue/sport', '/shop/tennis should render catalogue/sport.');

    const sportPayload = sportRes.locals.payload as any;
    const sportPage = sportPayload.catalogue?.sport;

    assert(Boolean(sportPage), '/shop/tennis payload should include sport view model.');
    assert(
      String(sportPage.hero?.title ?? '').toLowerCase().includes('tennis'),
      '/shop/tennis hero should display tennis context.',
    );

    assert(
      sportPage.categories.length > 0,
      '/shop/tennis should display tennis categories.',
    );
    assert(
      sportPage.categories.every((item: { url: string }) => item.url.startsWith('/shop/tennis/')),
      '/shop/tennis should display only tennis categories.',
    );

    assert(
      sportPage.featuredProducts.length > 0,
      '/shop/tennis should display tennis products.',
    );
    assert(
      sportPage.featuredProducts.every((item: { sportName: string }) => item.sportName.trim().toLowerCase() === 'tennis'),
      '/shop/tennis should display only tennis products.',
    );

    assert(
      sportPage.featuredBrands.length > 0,
      '/shop/tennis should display tennis brands.',
    );

    const tennisBrandSlugs = new Set(
      (
        await prisma.brand.findMany({
          where: {
            status: RecordStatus.ACTIVE,
            sport: {
              slug: 'tennis',
            },
          },
          select: {
            slug: true,
          },
        })
      ).map((brand) => brand.slug),
    );

    assert(
      sportPage.featuredBrands.every((item: { url: string }) => {
        const slug = item.url.replace('/brands/', '').trim();
        return tennisBrandSlugs.has(slug);
      }),
      '/shop/tennis should display only brands mapped to tennis.',
    );

    console.log('WF-010F Route Smoke: /shop/tennis/racquets render');
    const categoryReq = {
      path: '/shop/tennis/racquets',
      query: {
        page: '1',
        sort: 'featured',
      },
      params: {
        sport: 'tennis',
        category: 'racquets',
      },
    } as any;
    const categoryRes = createMockResponse() as any;

    await catalogueController.renderCategory(categoryReq, categoryRes);

    assert(
      categoryRes.locals.view === 'catalogue/category',
      '/shop/tennis/racquets should render catalogue/category.',
    );

    const categoryPayload = categoryRes.locals.payload as any;
    const categoryPage = categoryPayload.catalogue?.category;

    assert(Boolean(categoryPage), '/shop/tennis/racquets payload should include category view model.');

    const breadcrumbLabels = categoryPage.breadcrumbs.map((item: { label: string }) => item.label);

    assert(
      breadcrumbLabels.join(' > ') === 'Home > Shop > Tennis > Racquets',
      '/shop/tennis/racquets breadcrumb should be Home > Shop > Tennis > Racquets.',
    );

    assert(categoryPage.products.length > 0, '/shop/tennis/racquets should display a product grid.');
    assert(
      categoryPage.products.every((item: { sportName: string }) => item.sportName.trim().toLowerCase() === 'tennis'),
      '/shop/tennis/racquets should display only tennis products.',
    );

    assert(Boolean(categoryPage.filters), '/shop/tennis/racquets should display filter sidebar data.');
    assert(
      categoryPage.filters.actionUrl === '/shop/tennis/racquets',
      '/shop/tennis/racquets sidebar action URL should match route.',
    );

    assert(Boolean(categoryPage.sortToolbar), '/shop/tennis/racquets should display sort toolbar data.');
    assert(
      categoryPage.sortToolbar.actionUrl === '/shop/tennis/racquets',
      '/shop/tennis/racquets sort toolbar action URL should match route.',
    );

    assert(Boolean(categoryPage.pagination), '/shop/tennis/racquets should include pagination data.');
    assert(categoryPage.pagination.totalPages >= 1, '/shop/tennis/racquets pagination should render total pages.');
    assert(categoryPage.pagination.pages.length >= 1, '/shop/tennis/racquets pagination pages should render.');

    console.log('WF-010F Route Smoke: /brands/wilson render');
    const brandReq = {
      path: '/brands/wilson',
      query: {},
      params: {
        brand: 'wilson',
      },
    } as any;
    const brandRes = createMockResponse() as any;

    await catalogueController.renderBrand(brandReq, brandRes);

    assert(
      brandRes.locals.view === 'catalogue/brand',
      '/brands/wilson should render catalogue/brand.',
    );

    const brandPayload = brandRes.locals.payload as any;
    const brandPage = brandPayload.catalogue?.brand;

    assert(Boolean(brandPage), '/brands/wilson payload should include brand view model.');
    assert(
      String(brandPage.hero?.title ?? '').toLowerCase().includes('wilson'),
      '/brands/wilson hero should render Wilson context.',
    );
    assert(
      Boolean(String(brandPage.description ?? '').trim()),
      '/brands/wilson should display brand information.',
    );
    assert(brandPage.products.length > 0, '/brands/wilson should display products.');
    assert(
      brandPage.products.every((item: { brandName: string }) => item.brandName.trim().toLowerCase().includes('wilson')),
      '/brands/wilson should display only Wilson products.',
    );

    console.log('WF-010F Route Smoke: pass');
  } finally {
    console.log('WF-010F Route Smoke: cleanup');
    await cleanup(runTag);
    await prisma.$disconnect();
  }
}

void run().catch((error) => {
  console.error('WF-010F Route Smoke: fail');
  console.error(error);
  process.exitCode = 1;
});
