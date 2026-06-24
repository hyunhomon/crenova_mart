import { DeliveryStatus, createMockOrders } from '@/entities/order';
import { mockProducts } from '@/entities/product';
import { getStoredPaidOrder } from '@/features/payment/toss/model';

export const orderStatusOptions: { label: string; value: DeliveryStatus }[] = [
  { label: '배송 중', value: 'shipping' },
  { label: '배송 완료', value: 'delivered' },
  { label: '완료된 물품', value: 'completed' },
];

export function getOrders() {
  const paidOrder = getStoredPaidOrder();
  const mockOrders = createMockOrders(mockProducts);

  if (!paidOrder) {
    return mockOrders;
  }

  return [paidOrder, ...mockOrders.filter((order) => order.id !== paidOrder.id)];
}

export function getOrdersByStatus(status: DeliveryStatus) {
  return getOrders().filter((order) => order.status === status);
}

export function getOrderById(orderId: string) {
  return getOrders().find((order) => order.id === orderId);
}

export function getStatusBadgeVariant(status: DeliveryStatus) {
  switch (status) {
    case 'completed':
      return 'success';
    case 'delivered':
      return 'secondary';
    case 'shipping':
    default:
      return 'default';
  }
}
