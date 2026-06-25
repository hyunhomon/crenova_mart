import { PaymentMethod } from './types';

const paymentMethodLabels = {
  'kb-card': '국민카드 **** 1234',
  'kb-bank': '국민 **** 4321',
  'naver-pay': '네이버페이',
} satisfies Record<PaymentMethod, string>;

export function formatPaymentMethod(method: PaymentMethod) {
  return paymentMethodLabels[method];
}
