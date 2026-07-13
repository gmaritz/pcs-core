import { ImportResult } from '../types';
import { ImportPipeline } from './ImportPipeline';
import { NormalizedSupplierProduct } from '../models';

export interface ImportFrameworkAdapter {

  loadSource(): Promise<unknown>;

  parse(source: unknown): Promise<NormalizedSupplierProduct[]>;

}

export class ImportFramework {

  constructor(
    private readonly pipeline: ImportPipeline,
  ) {}

  async run(
    products: NormalizedSupplierProduct[],
  ): Promise<ImportResult> {

    return this.pipeline.execute(
      products,
    );

  }

}
