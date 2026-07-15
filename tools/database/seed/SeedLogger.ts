export class SeedLogger {
  info(message: string): void {
    console.log(`[seed] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[seed][warn] ${message}`);
  }

  error(message: string): void {
    console.error(`[seed][error] ${message}`);
  }
}
