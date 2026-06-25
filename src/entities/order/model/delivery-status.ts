import { DeliveryStatus } from './types';

const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  completed: '완료된 물품',
  delivered: '배송 완료',
  shipping: '배송 중',
};

const nextDeliveryStatus: Record<DeliveryStatus, DeliveryStatus> = {
  completed: 'completed',
  delivered: 'completed',
  shipping: 'delivered',
};

export function getDeliveryStatusLabel(status: DeliveryStatus) {
  return deliveryStatusLabels[status];
}

export function advanceDeliveryStatus(status: DeliveryStatus) {
  return nextDeliveryStatus[status];
}
