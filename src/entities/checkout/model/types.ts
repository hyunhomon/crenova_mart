import { CartLine } from '@/entities/cart';

export type ShippingAddress = {
  addressLine1: string;
  addressLine2?: string;
  name: string;
  phone: string;
  postalCode: string;
};

export type PaymentMethod = 'toss-payments-card' | 'toss-payments-transfer';

export type CheckoutDraft = {
  id: string;
  items: CartLine[];
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
};
