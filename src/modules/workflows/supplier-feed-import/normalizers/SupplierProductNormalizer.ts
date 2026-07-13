// ==========================================================
// Supplier Product Normalizer
// ==========================================================

import {
  SupplierNormalizer,
  NormalizedSupplierProduct,
} from '../../../../shared/import';
import {
  SupplierImportRawRecord,
} from '../types';

function normalizeText(
  value: unknown,
): string {

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();

}

export class SupplierProductNormalizer
  implements SupplierNormalizer<SupplierImportRawRecord> {

  async normalize(
    record: SupplierImportRawRecord,
  ): Promise<NormalizedSupplierProduct> {

    return {

      supplierSku: normalizeText(record.supplierSku),

      name: normalizeText(record.name),

      description: typeof record.description === 'string'
        ? record.description.trim()
        : undefined,

      brand: normalizeText(record.brand),

      category: normalizeText(record.category),

      sport: normalizeText(record.sport),

      variant: typeof record.variant === 'string'
        ? record.variant.trim()
        : undefined,

      barcode: typeof record.barcode === 'string'
        ? record.barcode.trim()
        : undefined,

      price: Number(record.price),

      quantity: Number(record.quantity),

      currency: typeof record.currency === 'string'
        ? record.currency.trim()
        : undefined,

      images: Array.isArray(record.images)
        ? record.images
          .filter((image): image is string => typeof image === 'string')
          .map((image) => image.trim())
        : undefined,

    };

  }

}

export const supplierProductNormalizer =
  new SupplierProductNormalizer();
