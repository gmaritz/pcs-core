// ==========================================================
// Imports
// ==========================================================

import {
  readFile,
} from 'node:fs/promises';
import path from 'node:path';

import {
} from '@prisma/client';

import { BaseService } from '../../../shared/services/BaseService';

import {
  supplierJsonParser,
} from '../parsers';
import {
  supplierProductNormalizer,
} from '../normalizers';
import {
  supplierImportValidator,
} from '../validators';
import {
  SupplierProductImporter,
} from '../importers';
import {
  ImportProductsDto,
  ImportReferenceData,
  SupplierImportRawRecord,
  SupplierImportRecord,
  SupplierImportSummary,
} from '../types';

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
  ): Promise<SupplierImportSummary> {

    const supplier = await this.db.supplier.findUnique({

      where: {
        id: dto.supplierId,
      },

    });

    if (!supplier) {
      throw new SupplierImportServiceError('Supplier not found.', 404);
    }

    const sample = await this.loadSample(
      dto.file,
    );

    const parsed = this.parse(
      sample,
    );

    const normalized = this.normalize(
      parsed,
    );

    const references = await this.loadReferenceData();

    this.validate(
      normalized,
      references,
    );

    return this.import(
      dto.supplierId,
      normalized,
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

  parse(
    content: string,
  ): SupplierImportRawRecord[] {

    try {

      return supplierJsonParser.parse(
        content,
      );

    } catch {

      throw new SupplierImportServiceError('Invalid JSON.', 400);

    }

  }

  normalize(
    records: SupplierImportRawRecord[],
  ): SupplierImportRecord[] {

    return supplierProductNormalizer.normalize(
      records,
    );

  }

  validate(
    records: SupplierImportRecord[],
    references: ImportReferenceData,
  ): void {

    const errors = supplierImportValidator.validate(
      records,
      references,
    );

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
    records: SupplierImportRecord[],
    references: ImportReferenceData,
  ): Promise<SupplierImportSummary> {

    return this.db.$transaction(async (tx) => {

      const importer = new SupplierProductImporter(
        tx,
        supplierId,
        references,
      );

      const result = await importer.importRecords(
        records,
      );

      return this.createSummary(
        records.length,
        result,
      );

    });

  }

  createSummary(
    processed: number,
    values: Omit<SupplierImportSummary, 'processed' | 'errors'>,
  ): SupplierImportSummary {

    return {
      processed,
      ...values,
      errors: [],
    };

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
