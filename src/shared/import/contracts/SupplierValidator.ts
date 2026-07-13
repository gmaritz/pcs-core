import { NormalizedSupplierProduct } from '../models';
import { ValidationResult } from '../types';

export interface SupplierValidator {

  validate(
    product: NormalizedSupplierProduct,
  ): Promise<ValidationResult>;

}
