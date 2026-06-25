import { PaymentMethod } from './types';

const paymentMethodLabels = {
  'toss-payments-card': '국민카드 **** 1234',
  'toss-payments-transfer': '국민 **** 4321',
} satisfies Record<PaymentMethod, string>;

export function formatPaymentMethod(method: PaymentMethod) {
  return paymentMethodLabels[method];
}
