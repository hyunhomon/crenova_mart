import { DeliveryStatus, createMockOrders } from '@/entities/order';
import { mockProducts } from '@/entities/product';
import { getStoredPaidOrder } from '@/features/payment/toss/model';

export type OrderStatusFilter = 'active' | 'delivered';

export const orderStatusOptions: { label: string; value: OrderStatusFilter }[] = [
  { label: '진행 중', value: 'active' },
  { label: '배송 완료', value: 'delivered' },
];

export function getOrders() {
  const paidOrder = getStoredPaidOrder();
  const mockOrders = createMockOrders(mockProducts);

  if (!paidOrder) {
    return mockOrders;
  }

  return [paidOrder, ...mockOrders.filter((order) => order.id !== paidOrder.id)];
}

export function getOrdersByStatus(status: OrderStatusFilter) {
  return getOrders().filter((order) =>
    status === 'delivered' ? order.status === 'delivered' : order.status !== 'delivered'
  );
}

export function getOrderById(orderId: string) {
  return getOrders().find((order) => order.id === orderId);
}

export function getStatusBadgeVariant(status: DeliveryStatus) {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'packed':
    case 'preparing':
      return 'secondary';
    case 'received':
      return 'warning';
    case 'shipping':
    default:
      return 'default';
  }
}
