// ==========================================================
// Supplier JSON Parser
// ==========================================================

import {
  SupplierImportParser,
  NormalizedSupplierProduct,
} from '../../../../shared/import';
import {
  SupplierImportRawRecord,
} from '../types';
import {
  supplierProductNormalizer,
} from '../normalizers';

export class SupplierJsonParser
  implements SupplierImportParser<string> {

  async parse(
    input: string,
  ): Promise<NormalizedSupplierProduct[]> {

    const parsed = JSON.parse(input) as unknown;

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid JSON import payload. Expected an array.');
    }

    const records = parsed as SupplierImportRawRecord[];

    return Promise.all(records.map((record) =>
      supplierProductNormalizer.normalize(record),
    ));

  }

}

export const supplierJsonParser =
  new SupplierJsonParser();
