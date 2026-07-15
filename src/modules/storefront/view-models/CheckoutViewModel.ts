export interface CheckoutSummaryItemViewModel {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

export interface CheckoutAddressViewModel {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  suburb?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface CheckoutViewModel {
  customerId: string;
  customerName: string;
  customerEmail: string;
  cartId: string;
  addressBook: CheckoutAddressViewModel[];
  billingAddressId?: string;
  shippingAddressId?: string;
  orderSummary: CheckoutSummaryItemViewModel[];
  orderTotal: string;
  placeOrderActionUrl: string;
  returnToCartUrl: string;
}
