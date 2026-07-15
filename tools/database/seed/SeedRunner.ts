import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { SeedContext } from './SeedContext';
import { SeedLogger } from './SeedLogger';
import { SeedSummary } from './SeedSummary';
import { SeedValidator } from './SeedValidator';
import {
  AttributesSeeder,
  BrandsSeeder,
  CategoriesSeeder,
  CustomersSeeder,
  InventorySeeder,
  MediaSeeder,
  OrdersSeeder,
  PricingSeeder,
  ProductVariantsSeeder,
  ProductsSeeder,
  SportsSeeder,
  SuppliersSeeder,
} from '../generators';

type RunOptions = {
  reset: boolean;
  validateOnly: boolean;
  buildStatus: 'PASS' | 'FAIL' | 'NOT_RUN';
};

export class SeedRunner {
  private readonly logger = new SeedLogger();
  private readonly validator = new SeedValidator();

  async run(options: RunOptions): Promise<SeedSummary> {
    const startedAt = Date.now();
    const context = new SeedContext();

    if (options.reset) {
      this.logger.info('Resetting canonical seed scope data.');
      await this.resetSeedScope(context);
    }

    if (!options.validateOnly) {
      await this.runSeeders(context);
    }

    const validation = await this.validator.validate(context);
    const platformVersion = this.validator.resolvePlatformVersion(context);

    const counts = {
      sports: await context.db.sport.count(),
      categories: await context.db.category.count(),
      brands: await context.db.brand.count(),
      specifications: await context.db.specification.count(),
      products: await context.db.product.count(),
      variants: await context.db.productVariant.count(),
      suppliers: await context.db.supplier.count(),
      warehouses: await context.db.warehouse.count(),
      inventory: await context.db.inventory.count(),
      customers: await context.db.customer.count(),
      orders: await context.db.order.count(),
      media: await context.db.media.count(),
    };

    const summary: SeedSummary = {
      datasetVersion: context.dataset.manifest.version,
      platformVersion,
      buildStatus: options.buildStatus,
      counts,
      durationMs: Date.now() - startedAt,
      warnings: validation.warnings,
      errors: validation.errors,
      passed: validation.passed,
    };

    this.writeValidationReports(context, summary);

    await context.db.$disconnect();

    return summary;
  }

  private async runSeeders(context: SeedContext): Promise<void> {
    this.logger.info(`Seeding dataset ${context.dataset.manifest.name} v${context.dataset.manifest.version}.`);

    await new SportsSeeder().run(context);
    await new CategoriesSeeder().run(context);
    await new BrandsSeeder().run(context);
    await new AttributesSeeder().run(context);
    await new SuppliersSeeder().run(context);
    await new ProductsSeeder().run(context);
    await new ProductVariantsSeeder().run(context);
    await new MediaSeeder().run(context);
    await new InventorySeeder().run(context);
    await new PricingSeeder().run(context);
    await new CustomersSeeder().run(context);
    await new OrdersSeeder().run(context);
  }

  private async resetSeedScope(context: SeedContext): Promise<void> {
    await context.db.orderItem.deleteMany();
    await context.db.payment.deleteMany();
    await context.db.shipment.deleteMany();
    await context.db.refund.deleteMany();
    await context.db.order.deleteMany();

    await context.db.cartItem.deleteMany();
    await context.db.cart.deleteMany();
    await context.db.wishlist.deleteMany();
    await context.db.address.deleteMany();
    await context.db.customer.deleteMany();

    await context.db.inventoryMovement.deleteMany();
    await context.db.inventory.deleteMany();
    await context.db.supplierProduct.deleteMany();
    await context.db.priceHistory.deleteMany();

    await context.db.productMedia.deleteMany();
    await context.db.media.deleteMany();
    await context.db.productSpecification.deleteMany();
    await context.db.specification.deleteMany();
    await context.db.seoMetadata.deleteMany();

    await context.db.productVariant.deleteMany();
    await context.db.product.deleteMany();

    await context.db.importJob.deleteMany();
    await context.db.supplierFeed.deleteMany();
    await context.db.supplier.deleteMany();
    await context.db.warehouse.deleteMany();

    await context.db.brand.deleteMany();
    await context.db.category.deleteMany();
    await context.db.sport.deleteMany();
  }

  private writeValidationReports(context: SeedContext, summary: SeedSummary): void {
    const reportRoot = path.join(context.repoRoot, 'docs', 'validation', 'MVP-002');
    const reportsDir = path.join(reportRoot, 'reports');

    mkdirSync(reportsDir, { recursive: true });

    const timestamp = this.createTimestamp();
    const gitCommit = this.resolveGitCommit(context.repoRoot);

    const status = summary.passed ? 'PASS' : 'FAIL';
    const lines = [
      '# MVP-002 Seed Validation Report',
      '',
      `- Status: ${status}`,
      `- Dataset Version: ${summary.datasetVersion}`,
      `- Platform Version: ${summary.platformVersion}`,
      `- Build Status: ${summary.buildStatus}`,
      `- Git Commit: ${gitCommit}`,
      `- Duration: ${summary.durationMs} ms`,
      '',
      '## Seed Counts',
      '',
      `- Sports: ${summary.counts.sports}`,
      `- Categories: ${summary.counts.categories}`,
      `- Brands: ${summary.counts.brands}`,
      `- Specifications: ${summary.counts.specifications}`,
      `- Products: ${summary.counts.products}`,
      `- Variants: ${summary.counts.variants}`,
      `- Inventory: ${summary.counts.inventory}`,
      `- Suppliers: ${summary.counts.suppliers}`,
      `- Warehouses: ${summary.counts.warehouses}`,
      `- Customers: ${summary.counts.customers}`,
      `- Orders: ${summary.counts.orders}`,
      `- Media: ${summary.counts.media}`,
      '',
      '## Validation Results',
      '',
      summary.errors.length > 0 ? '- Errors:' : '- Errors: none',
      ...summary.errors.map((item) => `  - ${item}`),
      summary.warnings.length > 0 ? '- Warnings:' : '- Warnings: none',
      ...summary.warnings.map((item) => `  - ${item}`),
      '',
      `- Final Result: ${status}`,
      '',
    ];

    const markdown = lines.join('\n');

    writeFileSync(path.join(reportRoot, 'seed-validation-report.md'), markdown, 'utf8');
    writeFileSync(path.join(reportsDir, `${timestamp}.md`), markdown, 'utf8');
  }

  private resolveGitCommit(repoRoot: string): string {
    const result = spawnSync('git rev-parse --short HEAD', {
      cwd: repoRoot,
      shell: true,
      encoding: 'utf8',
    });

    if (result.status !== 0) {
      return 'unknown';
    }

    return String(result.stdout || '').trim() || 'unknown';
  }

  private createTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}-${hours}${minutes}`;
  }
}
