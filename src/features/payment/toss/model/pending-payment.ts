import { Order, OrderItem } from '@/entities/order';

import { PendingTossPayment, TossPaymentSuccessParams } from './types';

const pendingPaymentKey = 'fandom-and:pending-toss-payment';
const paidOrderKey = 'fandom-and:last-paid-order';

export function savePendingTossPayment(payment: PendingTossPayment) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(pendingPaymentKey, JSON.stringify(payment));
}

export function clearPendingTossPayment() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(pendingPaymentKey);
}

export function resolveTossPaymentSuccess(params: TossPaymentSuccessParams) {
  const amount = Number(params.amount);
  const expectedAmount = Number(params.expectedAmount);
  const pendingPayment = getPendingTossPayment();
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

  savePaidOrder(order);
  clearPendingTossPayment();

  return {
    isValid: true,
    order,
  };
}

function getPendingTossPayment() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawPayment = window.sessionStorage.getItem(pendingPaymentKey);
  if (!rawPayment) {
    return null;
  }

  try {
    return JSON.parse(rawPayment) as PendingTossPayment;
  } catch {
    return null;
  }
}

function savePaidOrder(order: Order) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(paidOrderKey, JSON.stringify(order));
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
