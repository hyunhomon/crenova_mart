import { router } from 'expo-router';

import { CartProduct } from '@/entities/cart';

import { savePendingMockPayment } from './pending-payment';

export function buildPaymentOrderName(items: CartProduct[]) {
  const [firstItem] = items;

  if (!firstItem) {
    return '팬덤& 주문';
  }

  if (items.length === 1) {
    return firstItem.product.name;
  }

  return `${firstItem.product.name} 외 ${items.length - 1}건`;
}

export function startMockPayment({
  amount,
  items,
  orderName,
}: {
  amount: number;
  items: CartProduct[];
  orderName: string;
}) {
  const orderId = createOrderId();

  savePendingMockPayment({
    amount,
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    orderId,
    orderName,
  });

  router.push('/checkout/payment' as never);
}

export function createMockTransactionId(orderId: string) {
  const entropy = Math.random().toString(36).slice(2, 10);

  return `mock-${orderId}-${entropy}`;
}

function createOrderId() {
  const entropy = Math.random().toString(36).slice(2, 10);

  return `FD-${Date.now()}-${entropy}`;
}
