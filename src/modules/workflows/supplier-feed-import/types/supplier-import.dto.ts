// ==========================================================
// Supplier Import DTOs
// ==========================================================

import {
  Brand,
  Category,
  Sport,
} from '@prisma/client';

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

}

export interface SupplierImportRecord {

  supplierSku: string;

  name: string;

  brand: string;

  category: string;

  sport: string;

  price: number;

  quantity: number;

}

export interface SupplierImportSummary {

  processed: number;

  createdProducts: number;

  updatedProducts: number;

  createdVariants: number;

  updatedVariants: number;

  createdInventory: number;

  updatedInventory: number;

  errors: string[];

}

export interface SupplierImportSummaryDraft {

  createdProducts: number;

  updatedProducts: number;

  createdVariants: number;

  updatedVariants: number;

  createdInventory: number;

  updatedInventory: number;

}

export interface ImportReferenceData {

  brandsByName: Map<string, Brand>;

  categoriesByName: Map<string, Category>;

  sportsByName: Map<string, Sport>;

}
