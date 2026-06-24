import { DeliveryStatus } from './types';

const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  delivered: '배송 완료',
  shipping: '배송 중',
};

export function getDeliveryStatusLabel(status: DeliveryStatus) {
  return deliveryStatusLabels[status];
}
