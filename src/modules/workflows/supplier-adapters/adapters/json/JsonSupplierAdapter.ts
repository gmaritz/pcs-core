// ==========================================================
// JSON Supplier Adapter
// ==========================================================

import {
  NormalizedSupplierProduct,
  SupplierImportParser,
} from '../../../../../shared/import';

import {
  supplierProductNormalizer,
} from '../../../supplier-feed-import/normalizers';
import {
  SupplierImportRawRecord,
} from '../../../supplier-feed-import/types';

export class JsonSupplierAdapter
  implements SupplierImportParser<string> {

  async parse(
    source: string,
  ): Promise<NormalizedSupplierProduct[]> {

    const parsed = JSON.parse(source) as unknown;

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid JSON import payload. Expected an array.');
    }

    const records = parsed as SupplierImportRawRecord[];

    return Promise.all(records.map((record) =>
      supplierProductNormalizer.normalize(record),
    ));

  }

}

export const jsonSupplierAdapter =
  new JsonSupplierAdapter();
