import { OrderItem } from '@/entities/order';

export type PendingMockPayment = {
  amount: number;
  items: OrderItem[];
  orderId: string;
  orderName: string;
};

export type MockPaymentSuccessParams = {
  amount?: string;
  expectedAmount?: string;
  orderId?: string;
  transactionId?: string;
};
