import { ImportError } from './ImportError';

export interface ImportSummary {

  processed: number;

  createdProducts: number;

  updatedProducts: number;

  createdVariants: number;

  updatedVariants: number;

  createdInventory: number;

  updatedInventory: number;

  skipped: number;

  errors: ImportError[];

}
