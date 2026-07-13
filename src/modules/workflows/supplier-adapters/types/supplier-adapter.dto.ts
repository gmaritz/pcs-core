// ==========================================================
// Supplier Adapter DTOs
// ==========================================================

export enum SupplierFeedType {

  JSON = 'JSON',

}

export interface ImportJsonProductsDto {

  supplierId: string;

  file: string;

}
