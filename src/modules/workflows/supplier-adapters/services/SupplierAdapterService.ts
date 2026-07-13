// ==========================================================
// Imports
// ==========================================================

import {
  ImportFramework,
  ImportPipeline,
  ImportSummary,
  NormalizedSupplierProduct,
  SupplierImportParser,
} from '../../../../shared/import';

import {
  supplierImportService,
  SupplierImportServiceError,
} from '../../supplier-feed-import/services';
import {
  supplierAdapterFactory,
} from '../factories';
import {
  ImportJsonProductsDto,
  SupplierFeedType,
} from '../types';

// ==========================================================
// Errors
// ==========================================================

export class SupplierAdapterServiceError extends Error {

  readonly statusCode: number;

  readonly errors?: string[];

  constructor(
    message: string,
    statusCode: number,
    errors?: string[],
  ) {

    super(message);

    this.name = 'SupplierAdapterServiceError';

    this.statusCode = statusCode;

    this.errors = errors;

  }

}

// ==========================================================
// Supplier Adapter Service
// ==========================================================

export class SupplierAdapterService {

  async importJson(
    dto: ImportJsonProductsDto,
  ): Promise<ImportSummary> {

    const source = await this.loadSource(
      dto.file,
    );

    const adapter = supplierAdapterFactory.create(
      SupplierFeedType.JSON,
    );

    const products = await this.parseJson(
      adapter,
      source,
    );

    const framework = new ImportFramework(
      new ImportPipeline({
        import: (normalizedProducts) => supplierImportService.importNormalizedProducts(
          dto.supplierId,
          normalizedProducts,
        ),
      }),
    );

    const result = await framework.run(
      products,
    );

    return result.summary;

  }

  private async loadSource(
    file: string,
  ): Promise<string> {

    try {

      return await supplierImportService.loadSample(
        file,
      );

    } catch (error) {

      if (error instanceof SupplierImportServiceError) {
        throw error;
      }

      throw new SupplierAdapterServiceError('Sample file not found.', 400);

    }

  }

  private async parseJson(
    adapter: SupplierImportParser<string>,
    source: string,
  ): Promise<NormalizedSupplierProduct[]> {

    try {

      return await adapter.parse(
        source,
      );

    } catch {

      throw new SupplierAdapterServiceError('Invalid JSON.', 400);

    }

  }

}

export const supplierAdapterService =
  new SupplierAdapterService();
