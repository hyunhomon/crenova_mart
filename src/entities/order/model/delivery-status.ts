import { DeliveryStatus } from './types';

const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  delivered: '배송 완료',
  shipping: '배송 중',
};

const nextDeliveryStatus: Record<DeliveryStatus, DeliveryStatus> = {
  delivered: 'delivered',
  shipping: 'delivered',
};

export function getDeliveryStatusLabel(status: DeliveryStatus) {
  return deliveryStatusLabels[status];
}

export function advanceDeliveryStatus(status: DeliveryStatus) {
  return nextDeliveryStatus[status];
}
