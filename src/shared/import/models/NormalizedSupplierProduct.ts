export interface NormalizedSupplierProduct {

  supplierSku: string;

  name: string;

  description?: string;

  brand: string;

  category: string;

  sport: string;

  variant?: string;

  barcode?: string;

  price: number;

  quantity: number;

  currency?: string;

  images?: string[];

}
