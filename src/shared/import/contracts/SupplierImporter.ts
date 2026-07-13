import { ImportSummary, NormalizedSupplierProduct } from '../models';

export interface SupplierImporter {

  import(
    products: NormalizedSupplierProduct[],
  ): Promise<ImportSummary>;

}
