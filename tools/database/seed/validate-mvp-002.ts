import { spawnSync } from 'node:child_process';

function runCommand(command: string, env?: NodeJS.ProcessEnv): void {
  console.log(`\n[MVP-002] Running ${command}`);

  const result = spawnSync(command, {
    shell: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...env,
    },
  });

  if (result.error) {
    throw new Error(`Failed to execute \"${command}\": ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`Command \"${command}\" failed with exit code ${result.status ?? 'unknown'}.`);
  }
}

function main(): void {
  runCommand('npm run build');
  runCommand('npm run seed:reset', { MVP002_BUILD_STATUS: 'PASS' });
  runCommand('npm run seed:validate', { MVP002_BUILD_STATUS: 'PASS' });
  console.log('\n[MVP-002] Validation complete.');
}

try {
  main();
} catch (error) {
  console.error('\n[MVP-002] Validation failed.');
  console.error(error);
  process.exitCode = 1;
}
