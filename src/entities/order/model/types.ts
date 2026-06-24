import { PaymentMethod } from '@/entities/checkout';

export type DeliveryStatus = 'shipping' | 'delivered';

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderPayment = {
  approvedAt: string;
  method: PaymentMethod;
  paymentKey?: string;
  totalAmount: number;
};

export type Order = {
  createdAt: string;
  id: string;
  items: OrderItem[];
  orderNumber: string;
  payment: OrderPayment;
  status: DeliveryStatus;
};

export type OrderSummary = {
  itemCount: number;
  orderNumber: string;
  status: DeliveryStatus;
  subtotal: number;
  total: number;
};
