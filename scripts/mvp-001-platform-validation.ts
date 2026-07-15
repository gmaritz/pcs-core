import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

type ValidationCheck = {
  name: string;
  passed: boolean;
  detail: string;
};

const REPO_ROOT = path.resolve(__dirname, '..');
const SRC_ROOT = path.join(REPO_ROOT, 'src');

const WORKFLOW_COMMANDS = [
  'test:wf-009',
  'test:wf-010b',
  'test:wf-010c',
  'test:wf-010d',
  'test:wf-010e',
] as const;

const REQUIRED_PATHS = [
  'src/modules/storefront/facades/ShoppingFacade.ts',
  'src/modules/storefront/controllers/ShoppingController.ts',
  'src/modules/notification/services/NotificationService.ts',
  'src/modules/media/services/MediaService.ts',
  'src/modules/recommendation/services/RecommendationService.ts',
  'src/modules/content/services/PageMetadataService.ts',
  'src/modules/storefront/facades/ProductFacade.ts',
  'tests/workflows/wf-009-product-search.integration.ts',
  'tests/workflows/wf-010b-homepage.integration.ts',
  'tests/workflows/wf-010c-catalog.integration.ts',
  'tests/workflows/wf-010d-product.integration.ts',
  'tests/workflows/wf-010e-shopping.integration.ts',
  'docs/specifications/workflows/WF-001-Authentication.md',
  'docs/specifications/workflows/WF-002-Authorization.md',
  'docs/specifications/workflows/WF-005-Supplier-Import-Framework.md',
  'docs/specifications/workflows/WF-006-Supplier-Adapter-Framework.md',
  'docs/specifications/workflows/WF-007-Inventory-Synchronisation.md',
] as const;

function walkFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
      continue;
    }

    if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

function normalizeForReport(value: string): string {
  return value.split(path.sep).join('/');
}

function resolveRelativeImport(sourceFile: string, specifier: string): string | null {
  const base = path.resolve(path.dirname(sourceFile), specifier);
  const candidates = [
    `${base}.ts`,
    path.join(base, 'index.ts'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return path.resolve(candidate);
    }
  }

  return null;
}

function extractRelativeImports(fileContent: string): string[] {
  const matches = fileContent.matchAll(/(?:import|export)\s[^'"\n]*from\s+['"](\.[^'"]+)['"]/g);
  const imports: string[] = [];

  for (const match of matches) {
    const specifier = match[1];

    if (specifier) {
      imports.push(specifier);
    }
  }

  return imports;
}

function buildDependencyGraph(rootDir: string): Map<string, string[]> {
  const graph = new Map<string, string[]>();

  const files = walkFiles(rootDir)
    .filter((filePath) => filePath.endsWith('.ts'))
    .filter((filePath) => !filePath.endsWith('.d.ts'));

  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf8');
    const imports = extractRelativeImports(content)
      .map((specifier) => resolveRelativeImport(filePath, specifier))
      .filter((value): value is string => Boolean(value));

    graph.set(path.resolve(filePath), imports);
  }

  return graph;
}

function findDependencyCycle(graph: Map<string, string[]>): string[] | null {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const pathStack: string[] = [];

  function visit(node: string): string[] | null {
    if (stack.has(node)) {
      const startIndex = pathStack.indexOf(node);
      return [
        ...pathStack.slice(startIndex),
        node,
      ];
    }

    if (visited.has(node)) {
      return null;
    }

    visited.add(node);
    stack.add(node);
    pathStack.push(node);

    const dependencies = graph.get(node) ?? [];

    for (const dependency of dependencies) {
      if (!graph.has(dependency)) {
        continue;
      }

      const cycle = visit(dependency);

      if (cycle) {
        return cycle;
      }
    }

    pathStack.pop();
    stack.delete(node);
    return null;
  }

  for (const node of graph.keys()) {
    const cycle = visit(node);

    if (cycle) {
      return cycle;
    }
  }

  return null;
}

function runCheck(name: string, condition: boolean, detailWhenPass: string, detailWhenFail: string): ValidationCheck {
  return {
    name,
    passed: condition,
    detail: condition ? detailWhenPass : detailWhenFail,
  };
}

function runNpmScript(scriptName: string): void {
  const commandLabel = `npm run ${scriptName}`;

  console.log(`\n[MVP-001] Running ${commandLabel}`);

  const result = spawnSync(commandLabel, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  if (result.error) {
    throw new Error(`${commandLabel} failed to start: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`${commandLabel} failed with exit code ${result.status ?? 'unknown'}.`);
  }
}

function main(): void {
  const checks: ValidationCheck[] = [];

  checks.push(
    runCheck(
      'Required modules, workflows and docs are present',
      REQUIRED_PATHS.every((relativePath) => existsSync(path.join(REPO_ROOT, relativePath))),
      `Validated ${REQUIRED_PATHS.length} required paths.`,
      'One or more required module/workflow/doc paths are missing.',
    ),
  );

  const graph = buildDependencyGraph(SRC_ROOT);
  const cycle = findDependencyCycle(graph);

  checks.push(
    runCheck(
      'No circular TypeScript dependencies under src/',
      cycle === null,
      `Checked ${graph.size} TypeScript source files.`,
      `Circular dependency detected: ${(cycle ?? []).map((entry) => normalizeForReport(path.relative(REPO_ROOT, entry))).join(' -> ')}`,
    ),
  );

  const failedChecks = checks.filter((check) => !check.passed);

  console.log('\n[MVP-001] Static validation results');
  for (const check of checks) {
    const status = check.passed ? 'PASS' : 'FAIL';
    console.log(` - [${status}] ${check.name}: ${check.detail}`);
  }

  if (failedChecks.length > 0) {
    throw new Error('Static validation checks failed. Resolve failures before running workflow validation.');
  }

  runNpmScript('build');

  for (const workflowCommand of WORKFLOW_COMMANDS) {
    runNpmScript(workflowCommand);
  }

  console.log('\n[MVP-001] Platform validation complete.');
  console.log(`[MVP-001] Build + ${WORKFLOW_COMMANDS.length} workflow integration suites passed.`);
}

try {
  main();
} catch (error) {
  console.error('\n[MVP-001] Platform validation failed.');
  console.error(error);
  process.exitCode = 1;
}
