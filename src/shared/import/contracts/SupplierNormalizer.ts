import { NormalizedSupplierProduct } from '../models';

export interface SupplierNormalizer<TInput = unknown> {

  normalize(
    input: TInput,
  ): Promise<NormalizedSupplierProduct>;

}
