import { Order, OrderItem } from '@/entities/order';
import { getPreference, removePreference, setPreference } from '@/shared/lib/storage';

import { MockPaymentSuccessParams, PendingMockPayment } from './types';

const pendingPaymentKey = 'fandom-and:pending-mock-payment';
let pendingPaymentCache: PendingMockPayment | null | undefined;

export function savePendingMockPayment(payment: PendingMockPayment) {
  pendingPaymentCache = payment;
  setTimeout(() => {
    void setPreference(pendingPaymentKey, payment).catch((error) => {
      console.error('Failed to save pending payment.', error);
    });
  }, 0);
}

export function getCachedPendingMockPayment() {
  return pendingPaymentCache ?? null;
}

export async function getPendingMockPayment() {
  if (pendingPaymentCache !== undefined) {
    return pendingPaymentCache;
  }

  pendingPaymentCache = await getPreference<PendingMockPayment | null>(pendingPaymentKey, null);

  return pendingPaymentCache;
}

export function clearPendingMockPayment() {
  pendingPaymentCache = null;
  setTimeout(() => {
    void removePreference(pendingPaymentKey).catch((error) => {
      console.error('Failed to clear pending payment.', error);
    });
  }, 0);
}

export async function resolveMockPaymentSuccess(params: MockPaymentSuccessParams) {
  const amount = Number(params.amount);
  const expectedAmount = Number(params.expectedAmount);
  const pendingPayment = await getPendingMockPayment();
  const amountToVerify = pendingPayment?.amount ?? expectedAmount;
  const orderId = params.orderId;
  const transactionId = params.transactionId;
  const hasRequiredParams = Boolean(params.amount && orderId && transactionId);
  const isAmountMatched = Number.isFinite(amount) && amount === amountToVerify;

  if (!hasRequiredParams || !isAmountMatched || !orderId || !transactionId) {
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
    transactionId,
  });

  clearPendingMockPayment();

  return {
    isValid: true,
    order,
  };
}

function createPaidOrder({
  amount,
  items,
  orderId,
  orderName,
  transactionId,
}: {
  amount: number;
  items: OrderItem[];
  orderId: string;
  orderName: string;
  transactionId: string;
}): Order {
  return {
    createdAt: new Date().toISOString(),
    id: orderId,
    items:
      items.length > 0
        ? items.map((item, index) => ({
            ...item,
            id: createOrderItemId(orderId, index),
          }))
        : [
            {
              id: createOrderItemId(orderId, 0),
              productId: orderId,
              productName: orderName,
              quantity: 1,
              unitPrice: amount,
            },
          ],
    orderNumber: orderId,
    payment: {
      approvedAt: new Date().toISOString(),
      method: 'kb-card',
      paymentKey: transactionId,
      totalAmount: amount,
    },
    status: 'received',
  };
}

function createOrderItemId(orderId: string, index: number) {
  return `${orderId}:item:${index + 1}`;
}
