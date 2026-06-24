import { NotificationItem } from './types';

export const mockNotifications: NotificationItem[] = [
  {
    description: '새벽 응원 과일컵 세트가 배송을 시작했어요',
    id: 'notification-001',
    kind: 'delivery',
    timeLabel: '방금',
    title: '발송이 시작되었어요',
  },
  {
    description: '주문 결제가 정상적으로 처리되었어요',
    id: 'notification-002',
    kind: 'payment',
    timeLabel: '1시간 전',
    title: '결제가 완료되었어요',
  },
];
