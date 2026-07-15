import { readFileSync } from 'node:fs';
import path from 'node:path';

import { prisma } from '../../../src/infrastructure/database';

type DatasetManifest = {
  version: string;
  name: string;
  description: string;
  created: string;
  maintainer: string;
  minimumPlatformVersion: string;
};

type SportSeed = {
  code: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
};

type CategorySeed = {
  code: string;
  name: string;
  slug: string;
  sportCode: string;
  description?: string;
  displayOrder?: number;
};

type BrandSeed = {
  code: string;
  name: string;
  slug: string;
  sportCode: string;
  website?: string;
  description?: string;
  displayOrder?: number;
};

type AttributeSeed = {
  code: string;
  name: string;
  slug: string;
  sportCode: string;
  dataType: 'TEXT' | 'INTEGER' | 'DECIMAL' | 'BOOLEAN' | 'DATE';
  unit?: string | null;
  description?: string;
  displayOrder?: number;
};

type AttributeValueSeed = {
  specificationCode: string;
  values: string[];
};

type ProductsSeedConfig = {
  perCategory: number;
  namePrefixes: string[];
  nameSeries: string[];
  featuredEvery: number;
  categoryNouns: Record<string, string>;
};

type VariantOption = {
  code: string;
  label: string;
};

type VariantsSeedConfig = {
  profiles: Array<{
    categoryCodeContains: string;
    options: VariantOption[];
  }>;
  defaultOptions: VariantOption[];
};

type InventorySeedConfig = {
  warehouses: Array<{
    code: string;
    name: string;
    slug: string;
    city?: string;
    province?: string;
    country?: string;
    displayOrder?: number;
  }>;
  quantityOnHand: {
    minimum: number;
    maximum: number;
  };
  quantityReserved: {
    minimum: number;
    maximum: number;
  };
  reorderLevel: number;
};

type PricingSeedConfig = {
  defaultMarkupPercentage: number;
  categoryCostBands: Record<string, { minimum: number; maximum: number }>;
  defaultCostBand: { minimum: number; maximum: number };
};

type SupplierSeed = {
  code: string;
  name: string;
  slug: string;
  website?: string;
  email?: string;
  telephone?: string;
  description?: string;
  displayOrder?: number;
};

type CustomersSeedConfig = {
  count: number;
  emailDomain: string;
  telephonePrefix: string;
  firstNames: string[];
  lastNames: string[];
  cities: string[];
  provinces: string[];
  postalCodes: string[];
  accountAgeStartDays: number;
  accountAgeStepDays: number;
};

type OrdersSeedConfig = {
  count: number;
  statuses: Record<'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED', number>;
  itemsPerOrder: {
    minimum: number;
    maximum: number;
  };
  notes: string[];
};

type MediaSeedConfig = {
  baseUrl: string;
  placeholderExt: string;
  galleryPerProduct: number;
  altTemplate: string;
};

export type CanonicalDataset = {
  manifest: DatasetManifest;
  sports: SportSeed[];
  categories: CategorySeed[];
  brands: BrandSeed[];
  attributes: AttributeSeed[];
  attributeValues: AttributeValueSeed[];
  products: ProductsSeedConfig;
  variants: VariantsSeedConfig;
  inventory: InventorySeedConfig;
  pricing: PricingSeedConfig;
  suppliers: SupplierSeed[];
  customers: CustomersSeedConfig;
  orders: OrdersSeedConfig;
  media: MediaSeedConfig;
};

export class SeedContext {
  readonly repoRoot: string;
  readonly canonicalRoot: string;
  readonly dataset: CanonicalDataset;

  constructor(repoRoot?: string) {
    this.repoRoot = repoRoot ?? path.resolve(__dirname, '../../..');
    this.canonicalRoot = path.join(this.repoRoot, 'data', 'canonical');
    this.dataset = {
      manifest: this.readJsonFile<DatasetManifest>('dataset.json'),
      sports: this.readJsonFile<SportSeed[]>('sports.json'),
      categories: this.readJsonFile<CategorySeed[]>('categories.json'),
      brands: this.readJsonFile<BrandSeed[]>('brands.json'),
      attributes: this.readJsonFile<AttributeSeed[]>('attributes.json'),
      attributeValues: this.readJsonFile<AttributeValueSeed[]>('attribute-values.json'),
      products: this.readJsonFile<ProductsSeedConfig>('products.json'),
      variants: this.readJsonFile<VariantsSeedConfig>('variants.json'),
      inventory: this.readJsonFile<InventorySeedConfig>('inventory.json'),
      pricing: this.readJsonFile<PricingSeedConfig>('pricing.json'),
      suppliers: this.readJsonFile<SupplierSeed[]>('suppliers.json'),
      customers: this.readJsonFile<CustomersSeedConfig>('customers.json'),
      orders: this.readJsonFile<OrdersSeedConfig>('orders.json'),
      media: this.readJsonFile<MediaSeedConfig>('media.json'),
    };
  }

  get db() {
    return prisma;
  }

  private readJsonFile<T>(filename: string): T {
    const absolutePath = path.join(this.canonicalRoot, filename);
    const raw = readFileSync(absolutePath, 'utf8');
    return JSON.parse(raw) as T;
  }
}
