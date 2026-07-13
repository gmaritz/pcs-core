// ==========================================================
// Supplier JSON Parser
// ==========================================================

import {
  SupplierImportRawRecord,
} from '../types';

export class SupplierJsonParser {

  parse(
    input: string,
  ): SupplierImportRawRecord[] {

    const parsed = JSON.parse(input) as unknown;

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid JSON import payload. Expected an array.');
    }

    return parsed as SupplierImportRawRecord[];

  }

}

export const supplierJsonParser =
  new SupplierJsonParser();
