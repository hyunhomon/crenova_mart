import { DeliveryStatus } from './types';

export const deliveryStatusSteps = [
  'received',
  'preparing',
  'packed',
  'shipping',
  'delivered',
] as const satisfies readonly DeliveryStatus[];

const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  delivered: '배송 완료',
  packed: '출고 완료',
  preparing: '상품 준비',
  received: '주문 접수',
  shipping: '배송 중',
};

export function getDeliveryStatusLabel(status: DeliveryStatus) {
  return deliveryStatusLabels[status];
}

export function isDeliveryStatusReached(currentStatus: DeliveryStatus, step: DeliveryStatus) {
  return deliveryStatusSteps.indexOf(step) <= deliveryStatusSteps.indexOf(currentStatus);
}
