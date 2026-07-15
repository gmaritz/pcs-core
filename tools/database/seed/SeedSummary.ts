export type SeedEntityCounts = {
  sports: number;
  categories: number;
  brands: number;
  specifications: number;
  products: number;
  variants: number;
  suppliers: number;
  warehouses: number;
  inventory: number;
  customers: number;
  orders: number;
  media: number;
};

export type SeedSummary = {
  datasetVersion: string;
  platformVersion: string;
  buildStatus: 'PASS' | 'FAIL' | 'NOT_RUN';
  counts: SeedEntityCounts;
  durationMs: number;
  warnings: string[];
  errors: string[];
  passed: boolean;
};
