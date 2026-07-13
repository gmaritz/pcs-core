import { NormalizedSupplierProduct } from '../models';

export interface SupplierImportParser<TSource = unknown> {

  parse(
    source: TSource,
  ): Promise<NormalizedSupplierProduct[]>;

}
