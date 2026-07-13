import {
  RecordStatus,
} from '@prisma/client';

import { prisma } from '../../src/infrastructure/database';
import { productSearchService } from '../../src/modules/search/services';

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
) {

  const sportTennis = await prisma.sport.create({
    data: {
      name: `WF009 Tennis ${runTag}`,
      code: `WF009-SP-TENNIS-${runTag}`,
      slug: `wf009-sp-tennis-${runTag}`,
    },
  });

  const sportPadel = await prisma.sport.create({
    data: {
      name: `WF009 Padel ${runTag}`,
      code: `WF009-SP-PADEL-${runTag}`,
      slug: `wf009-sp-padel-${runTag}`,
    },
  });

  const categoryRacquets = await prisma.category.create({
    data: {
      name: `WF009 Tennis Racquets ${runTag}`,
      code: `WF009-CAT-RACQ-${runTag}`,
      slug: `wf009-cat-racq-${runTag}`,
      sportId: sportTennis.id,
    },
  });

  const categoryShoes = await prisma.category.create({
    data: {
      name: `WF009 Shoes ${runTag}`,
      code: `WF009-CAT-SHOES-${runTag}`,
      slug: `wf009-cat-shoes-${runTag}`,
      sportId: sportTennis.id,
    },
  });

  const brandWilson = await prisma.brand.create({
    data: {
      name: `WF009 Wilson ${runTag}`,
      code: `WF009-BR-WILSON-${runTag}`,
      slug: `wf009-br-wilson-${runTag}`,
      sportId: sportTennis.id,
    },
  });

  const brandHead = await prisma.brand.create({
    data: {
      name: `WF009 Head ${runTag}`,
      code: `WF009-BR-HEAD-${runTag}`,
      slug: `wf009-br-head-${runTag}`,
      sportId: sportTennis.id,
    },
  });

  const proStaffProduct = await prisma.product.create({
    data: {
      name: `WF009 Pro Staff ${runTag}`,
      code: `WF009-PR-PROSTAFF-${runTag}`,
      slug: `wf009-pr-prostaff-${runTag}`,
      description: 'Legendary control frame',
      sportId: sportTennis.id,
      categoryId: categoryRacquets.id,
      brandId: brandWilson.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const bladeProduct = await prisma.product.create({
    data: {
      name: `WF009 Blade ${runTag}`,
      code: `WF009-PR-BLADE-${runTag}`,
      slug: `wf009-pr-blade-${runTag}`,
      description: 'Modern feel and spin',
      sportId: sportTennis.id,
      categoryId: categoryRacquets.id,
      brandId: brandWilson.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const gravityProduct = await prisma.product.create({
    data: {
      name: `WF009 Gravity ${runTag}`,
      code: `WF009-PR-GRAVITY-${runTag}`,
      slug: `wf009-pr-gravity-${runTag}`,
      description: 'Round head shape for control',
      sportId: sportTennis.id,
      categoryId: categoryRacquets.id,
      brandId: brandHead.id,
      status: RecordStatus.ACTIVE,
    },
  });

  const inactiveProduct = await prisma.product.create({
    data: {
      name: `WF009 Inactive ${runTag}`,
      code: `WF009-PR-INACTIVE-${runTag}`,
      slug: `wf009-pr-inactive-${runTag}`,
      description: 'Should be excluded from search',
      sportId: sportPadel.id,
      categoryId: categoryShoes.id,
      brandId: brandHead.id,
      status: RecordStatus.INACTIVE,
    },
  });

  const proStaffVariant = await prisma.productVariant.create({
    data: {
      name: `WF009 Pro Staff 97 ${runTag}`,
      sku: `WF009-SKU-PROSTAFF-${runTag}`,
      slug: `wf009-sku-prostaff-${runTag}`,
      productId: proStaffProduct.id,
      sellingPrice: 4454.93,
      status: RecordStatus.ACTIVE,
    },
  });

  const bladeVariant = await prisma.productVariant.create({
    data: {
      name: `WF009 Blade 98 ${runTag}`,
      sku: `WF009-SKU-BLADE-${runTag}`,
      slug: `wf009-sku-blade-${runTag}`,
      productId: bladeProduct.id,
      sellingPrice: 3899.0,
      status: RecordStatus.ACTIVE,
    },
  });

  const gravityVariant = await prisma.productVariant.create({
    data: {
      name: `WF009 Gravity Tour ${runTag}`,
      sku: `WF009-SKU-GRAVITY-${runTag}`,
      slug: `wf009-sku-gravity-${runTag}`,
      productId: gravityProduct.id,
      sellingPrice: 2999.0,
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.productVariant.create({
    data: {
      name: `WF009 Inactive Variant ${runTag}`,
      sku: `WF009-SKU-INACTIVE-${runTag}`,
      slug: `wf009-sku-inactive-${runTag}`,
      productId: inactiveProduct.id,
      sellingPrice: 1200.0,
      status: RecordStatus.ACTIVE,
    },
  });

  await prisma.inventory.create({
    data: {
      productVariantId: proStaffVariant.id,
      quantityOnHand: 10,
      quantityReserved: 2,
    },
  });

  await prisma.inventory.create({
    data: {
      productVariantId: bladeVariant.id,
      quantityOnHand: 0,
      quantityReserved: 0,
    },
  });

  await prisma.inventory.create({
    data: {
      productVariantId: gravityVariant.id,
      quantityOnHand: 5,
      quantityReserved: 0,
    },
  });

  return {
    labels: {
      wilson: brandWilson.name,
      racquets: categoryRacquets.name,
    },
  };

}

async function cleanup(
  runTag: string,
): Promise<void> {

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

async function run(): Promise<void> {

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run WF-009 integration checks.');
  }

  const runTag = Date.now().toString();

  try {

    console.log('WF-009 Integration: setup');

    const fixture = await createFixture(runTag);

    console.log('WF-009 Integration: test 1 keyword search');

    const keywordResult = await productSearchService.search({
      q: 'pro staff',
    });

    assert(keywordResult.total === 1, 'Keyword search should return one matching record.');
    assert(
      keywordResult.results[0].productName.includes('Pro Staff'),
      'Keyword search should match Pro Staff product.',
    );

    console.log('WF-009 Integration: test 2 brand filter');

    const brandResult = await productSearchService.search({
      brand: fixture.labels.wilson,
    });

    assert(brandResult.total === 2, 'Brand filter should return only Wilson products.');
    assert(
      brandResult.results.every((result) => result.brand === fixture.labels.wilson),
      'Brand filter should include only Wilson records.',
    );

    console.log('WF-009 Integration: test 3 category filter');

    const categoryResult = await productSearchService.search({
      category: fixture.labels.racquets,
    });

    assert(categoryResult.total === 3, 'Category filter should return only racquet products.');

    console.log('WF-009 Integration: test 4 price range');

    const priceRangeResult = await productSearchService.search({
      minPrice: 3000,
      maxPrice: 4000,
      sort: 'price-asc',
    });

    assert(priceRangeResult.total === 1, 'Price range should return one matching product.');
    assert(
      priceRangeResult.results[0].productName.includes('Blade'),
      'Price range should return Blade product.',
    );

    console.log('WF-009 Integration: test 5 pagination');

    const pageOneResult = await productSearchService.search({
      sort: 'name-asc',
      page: 1,
      pageSize: 1,
    });

    const pageTwoResult = await productSearchService.search({
      sort: 'name-asc',
      page: 2,
      pageSize: 1,
    });

    assert(pageOneResult.total === 3, 'Pagination should report full total count.');
    assert(pageTwoResult.results.length === 1, 'Pagination should return one record on page two.');
    assert(
      pageOneResult.results[0].productId !== pageTwoResult.results[0].productId,
      'Pagination should return a different record on page two.',
    );

    console.log('WF-009 Integration: test 6 sort by price ascending');

    const sortResult = await productSearchService.search({
      sort: 'price-asc',
    });

    const prices = sortResult.results.map((result) => result.sellingPrice);

    assert(
      prices.every((price, index) => index === 0 || prices[index - 1] <= price),
      'Sort by price ascending should be ordered correctly.',
    );

    console.log('WF-009 Integration: test 7 case insensitive search');

    const lowerCaseResult = await productSearchService.search({
      q: 'gravity',
    });

    const upperCaseResult = await productSearchService.search({
      q: 'GRAVITY',
    });

    assert(
      lowerCaseResult.total === upperCaseResult.total,
      'Case insensitive search should produce same total.',
    );

    assert(
      lowerCaseResult.results[0].productId === upperCaseResult.results[0].productId,
      'Case insensitive search should produce same top result.',
    );

    console.log('WF-009 Integration: all scenarios passed');

  } finally {

    await cleanup(runTag);

  }

}

void run()
  .catch(async (error) => {
    console.error('WF-009 Integration: failed');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
