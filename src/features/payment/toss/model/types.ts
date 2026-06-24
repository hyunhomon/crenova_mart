import { OrderItem } from '@/entities/order';

export type PendingTossPayment = {
  amount: number;
  items: OrderItem[];
  orderId: string;
  orderName: string;
};

export type TossPaymentSuccessParams = {
  amount?: string;
  expectedAmount?: string;
  orderId?: string;
  paymentKey?: string;
};
