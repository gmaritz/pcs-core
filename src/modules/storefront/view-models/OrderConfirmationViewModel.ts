export interface OrderConfirmationItemViewModel {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

export interface OrderConfirmationViewModel {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  status: string;
  items: OrderConfirmationItemViewModel[];
  orderTotal: string;
  continueShoppingUrl: string;
}
