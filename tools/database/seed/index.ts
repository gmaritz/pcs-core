import { SeedRunner } from './SeedRunner';

function parseBuildStatus(raw: string | undefined): 'PASS' | 'FAIL' | 'NOT_RUN' {
  if (raw === 'PASS' || raw === 'FAIL' || raw === 'NOT_RUN') {
    return raw;
  }

  return 'NOT_RUN';
}

function parseArguments(argv: string[]): { reset: boolean; validateOnly: boolean } {
  return {
    reset: argv.includes('--reset'),
    validateOnly: argv.includes('--validate'),
  };
}

async function run(): Promise<void> {
  const args = parseArguments(process.argv.slice(2));

  const runner = new SeedRunner();

  const summary = await runner.run({
    reset: args.reset,
    validateOnly: args.validateOnly,
    buildStatus: parseBuildStatus(process.env.MVP002_BUILD_STATUS),
  });

  const status = summary.passed ? 'PASS' : 'FAIL';

  console.log('\nSeed Summary');
  console.log(`Dataset Version: ${summary.datasetVersion}`);
  console.log(`Platform Version: ${summary.platformVersion}`);
  console.log(`Build: ${summary.buildStatus}`);
  console.log(`Sports: ${summary.counts.sports}`);
  console.log(`Categories: ${summary.counts.categories}`);
  console.log(`Brands: ${summary.counts.brands}`);
  console.log(`Products: ${summary.counts.products}`);
  console.log(`Variants: ${summary.counts.variants}`);
  console.log(`Inventory: ${summary.counts.inventory}`);
  console.log(`Pricing: ${summary.counts.variants}`);
  console.log(`Customers: ${summary.counts.customers}`);
  console.log(`Orders: ${summary.counts.orders}`);
  console.log(`Suppliers: ${summary.counts.suppliers}`);
  console.log(`Duration: ${summary.durationMs} ms`);
  console.log(`Warnings: ${summary.warnings.length}`);
  console.log(`Errors: ${summary.errors.length}`);
  console.log(`Result: ${status}`);

  if (!summary.passed) {
    process.exitCode = 1;
  }
}

void run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
