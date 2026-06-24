import { Order, OrderSummary } from './types';

export function calculateOrderSummary(order: Order): OrderSummary {
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = order.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  return {
    itemCount,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal,
    total: order.payment.totalAmount,
  };
}
