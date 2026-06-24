import { NotificationItem } from './types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notification-001',
    kind: 'delivery',
    message: '새벽 응원 과일컵 세트',
    timeLabel: '방금',
    title: '배송 시작',
    unread: true,
  },
  {
    id: 'notification-002',
    kind: 'order',
    message: '주문번호 20260625-001',
    timeLabel: '1시간 전',
    title: '결제 완료',
    unread: true,
  },
  {
    id: 'notification-003',
    kind: 'cart',
    message: '보라빛 응원봉',
    timeLabel: '어제',
    title: '장바구니 상품',
    unread: false,
  },
  {
    id: 'notification-004',
    kind: 'event',
    message: '포토카드 굿즈 모음',
    timeLabel: '2일 전',
    title: '추천 상품',
    unread: false,
  },
];
