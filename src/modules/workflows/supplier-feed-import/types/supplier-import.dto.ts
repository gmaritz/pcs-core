// ==========================================================
// Supplier Import DTOs
// ==========================================================

import {
  Brand,
  Category,
  Sport,
} from '@prisma/client';
import {
  ImportError,
  ImportSummary,
  NormalizedSupplierProduct,
} from '../../../../shared/import';
import {
  ValidationResult,
} from '../../../../shared/import';

export interface ImportProductsDto {

  supplierId: string;

  file: string;

}

export interface SupplierImportRawRecord {

  supplierSku?: unknown;

  name?: unknown;

  brand?: unknown;

  category?: unknown;

  sport?: unknown;

  price?: unknown;

  quantity?: unknown;

  description?: unknown;

  variant?: unknown;

  barcode?: unknown;

  currency?: unknown;

  images?: unknown;

}

export type SupplierImportRecord = NormalizedSupplierProduct;

export type SupplierImportSummary = ImportSummary;

export type SupplierImportSummaryDraft = Omit<ImportSummary, 'processed' | 'skipped' | 'errors'>;

export type SupplierImportValidationResult = ValidationResult;

export type SupplierImportIssue = ImportError;

export interface ImportReferenceData {

  brandsByName: Map<string, Brand>;

  categoriesByName: Map<string, Category>;

  sportsByName: Map<string, Sport>;

}
