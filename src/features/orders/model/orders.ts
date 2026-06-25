import { DeliveryStatus } from '@/entities/order';

export type OrderStatusFilter = 'active' | 'delivered';

export const orderStatusOptions: { label: string; value: OrderStatusFilter }[] = [
  { label: '진행 중', value: 'active' },
  { label: '배송 완료', value: 'delivered' },
];

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
