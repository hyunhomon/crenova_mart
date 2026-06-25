import { Order, OrderItem } from '@/entities/order';
import { getPreference, removePreference, setPreference } from '@/shared/lib/storage';

import { PendingTossPayment, TossPaymentSuccessParams } from './types';

const pendingPaymentKey = 'fandom-and:pending-toss-payment';

export async function savePendingTossPayment(payment: PendingTossPayment) {
  await setPreference(pendingPaymentKey, payment);
}

export async function clearPendingTossPayment() {
  await removePreference(pendingPaymentKey);
}

export async function resolveTossPaymentSuccess(params: TossPaymentSuccessParams) {
  const amount = Number(params.amount);
  const expectedAmount = Number(params.expectedAmount);
  const pendingPayment = await getPendingTossPayment();
  const amountToVerify = pendingPayment?.amount ?? expectedAmount;
  const orderId = params.orderId;
  const paymentKey = params.paymentKey;
  const hasRequiredParams = Boolean(params.amount && orderId && paymentKey);
  const isAmountMatched = Number.isFinite(amount) && amount === amountToVerify;

  if (!hasRequiredParams || !isAmountMatched || !orderId || !paymentKey) {
    return {
      isValid: false,
      order: null,
    };
  }

  const order = createPaidOrder({
    amount,
    items: pendingPayment?.items ?? [],
    orderId,
    orderName: pendingPayment?.orderName ?? orderId,
    paymentKey,
  });

  await clearPendingTossPayment();

  return {
    isValid: true,
    order,
  };
}

function getPendingTossPayment() {
  return getPreference<PendingTossPayment | null>(pendingPaymentKey, null);
}

function createPaidOrder({
  amount,
  items,
  orderId,
  orderName,
  paymentKey,
}: {
  amount: number;
  items: OrderItem[];
  orderId: string;
  orderName: string;
  paymentKey: string;
}): Order {
  return {
    createdAt: new Date().toISOString(),
    id: orderId,
    items:
      items.length > 0
        ? items
        : [
            {
              id: `${orderId}:item`,
              productId: orderId,
              productName: orderName,
              quantity: 1,
              unitPrice: amount,
            },
          ],
    orderNumber: orderId,
    payment: {
      approvedAt: new Date().toISOString(),
      method: 'toss-payments-card',
      paymentKey,
      totalAmount: amount,
    },
    status: 'shipping',
  };
}
