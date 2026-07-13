// ==========================================================
// Supplier Product Normalizer
// ==========================================================

import {
  SupplierImportRawRecord,
  SupplierImportRecord,
} from '../types';

function normalizeText(
  value: unknown,
): string {

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();

}

export class SupplierProductNormalizer {

  normalize(
    records: SupplierImportRawRecord[],
  ): SupplierImportRecord[] {

    return records.map((record) => ({

      supplierSku: normalizeText(record.supplierSku),

      name: normalizeText(record.name),

      brand: normalizeText(record.brand),

      category: normalizeText(record.category),

      sport: normalizeText(record.sport),

      price: Number(record.price),

      quantity: Number(record.quantity),

    }));

  }

}

export const supplierProductNormalizer =
  new SupplierProductNormalizer();
