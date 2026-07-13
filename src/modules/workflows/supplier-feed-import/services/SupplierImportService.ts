// ==========================================================
// Imports
// ==========================================================

import {
  readFile,
} from 'node:fs/promises';
import path from 'node:path';

import {
  ImportSummary,
  NormalizedSupplierProduct,
} from '../../../../shared/import';
import { BaseService } from '../../../shared/services/BaseService';

import {
  supplierJsonParser,
} from '../parsers';
import {
  SupplierProductImporter,
} from '../importers';
import {
  ImportProductsDto,
  ImportReferenceData,
} from '../types';
import {
  supplierImportValidator,
} from '../validators';

// ==========================================================
// Errors
// ==========================================================

export class SupplierImportServiceError extends Error {

  readonly statusCode: number;

  readonly errors?: string[];

  constructor(
    message: string,
    statusCode: number,
    errors?: string[],
  ) {

    super(message);

    this.name = 'SupplierImportServiceError';

    this.statusCode = statusCode;

    this.errors = errors;

  }

}

// ==========================================================
// Supplier Import Service
// ==========================================================

export class SupplierImportService extends BaseService {

  async importProducts(
    dto: ImportProductsDto,
  ): Promise<ImportSummary> {

    const sample = await this.loadSample(
      dto.file,
    );

    const products = await this.parse(
      sample,
    );

    return this.importNormalizedProducts(
      dto.supplierId,
      products,
    );

  }

  async importNormalizedProducts(
    supplierId: string,
    products: NormalizedSupplierProduct[],
  ): Promise<ImportSummary> {

    const supplier = await this.db.supplier.findUnique({

      where: {
        id: supplierId,
      },

    });

    if (!supplier) {
      throw new SupplierImportServiceError('Supplier not found.', 404);
    }

    const references = await this.loadReferenceData();

    await this.validate(
      products,
    );

    return this.import(
      supplierId,
      products,
      references,
    );

  }

  async loadSample(
    file: string,
  ): Promise<string> {

    const baseName = path.basename(file);

    const samplePath = path.resolve(
      process.cwd(),
      'src/modules/workflows/supplier-feed-import/sample-data',
      baseName,
    );

    try {

      return await readFile(
        samplePath,
        'utf8',
      );

    } catch {

      throw new SupplierImportServiceError('Sample file not found.', 400);

    }

  }

  async parse(
    content: string,
  ): Promise<NormalizedSupplierProduct[]> {

    try {

      return await supplierJsonParser.parse(
        content,
      );

    } catch {

      throw new SupplierImportServiceError('Invalid JSON.', 400);

    }

  }

  async validate(
    products: NormalizedSupplierProduct[],
  ): Promise<void> {

    const validationResults = await Promise.all(
      products.map((product) => supplierImportValidator.validate(product)),
    );

    const errors = validationResults.flatMap((result, index) => (
      result.valid
        ? []
        : result.errors.map((error) => `Row ${index + 1}: ${error}`)
    ));

    if (errors.length > 0) {
      throw new SupplierImportServiceError(
        'Validation failed.',
        400,
        errors,
      );
    }

  }

  async import(
    supplierId: string,
    products: NormalizedSupplierProduct[],
    references: ImportReferenceData,
  ): Promise<ImportSummary> {

    return this.db.$transaction(async (tx) => {

      const importer = new SupplierProductImporter(
        tx,
        supplierId,
        references,
      );

      return importer.import(
        products,
      );

    });

  }

  private async loadReferenceData(): Promise<ImportReferenceData> {

    const [brands, categories, sports] = await Promise.all([
      this.db.brand.findMany(),
      this.db.category.findMany(),
      this.db.sport.findMany(),
    ]);

    const brandsByName = new Map(
      brands.map((brand) => [
        brand.name.trim().toLowerCase(),
        brand,
      ]),
    );

    const categoriesByName = new Map(
      categories.map((category) => [
        category.name.trim().toLowerCase(),
        category,
      ]),
    );

    const sportsByName = new Map(
      sports.map((sport) => [
        sport.name.trim().toLowerCase(),
        sport,
      ]),
    );

    return {
      brandsByName,
      categoriesByName,
      sportsByName,
    };

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const supplierImportService =
  new SupplierImportService();
