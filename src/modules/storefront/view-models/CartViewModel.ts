export interface CartItemViewModel {
  cartItemId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  imageUrl: string;
  imageAlt: string;
  availabilityLabel: string;
  isAvailable: boolean;
}

export interface CartViewModel {
  customerId: string;
  cartId: string;
  items: CartItemViewModel[];
  itemCount: number;
  cartTotal: string;
  checkoutUrl: string;
  continueShoppingUrl: string;
}
