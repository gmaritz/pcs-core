export interface AccountOrderSummaryViewModel {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  itemCount: number;
  orderTotal: string;
  confirmationUrl: string;
}

export interface CustomerAccountViewModel {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerTelephone?: string;
  currentOrders: AccountOrderSummaryViewModel[];
  previousOrders: AccountOrderSummaryViewModel[];
}
