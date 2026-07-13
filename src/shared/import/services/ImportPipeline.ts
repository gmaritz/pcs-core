import {
  ImportSummary,
  NormalizedSupplierProduct,
} from '../models';
import { ImportResult } from '../types';

export interface ImportPipelineAdapter {

  import(
    products: NormalizedSupplierProduct[],
  ): Promise<ImportSummary>;

}

export class ImportPipeline {

  constructor(
    private readonly importer: ImportPipelineAdapter,
  ) {}

  async execute(
    products: NormalizedSupplierProduct[],
  ): Promise<ImportResult> {

    const summary = await this.importer.import(
      products,
    );

    return {
      success: true,
      summary,
    };

  }

}
