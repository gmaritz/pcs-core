// ==========================================================
// Supplier Adapter Factory
// ==========================================================

import {
  SupplierImportParser,
} from '../../../../shared/import';

import {
  jsonSupplierAdapter,
} from '../adapters';
import {
  SupplierFeedType,
} from '../types';

export class SupplierAdapterFactory {

  create(
    feedType: SupplierFeedType,
  ): SupplierImportParser<string> {

    switch (feedType) {

    case SupplierFeedType.JSON:
      return jsonSupplierAdapter;

    default:
      throw new Error(`Unsupported supplier feed type: ${feedType}.`);

    }

  }

}

export const supplierAdapterFactory =
  new SupplierAdapterFactory();
