export type NotificationKind = 'cart' | 'delivery' | 'event' | 'order';

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  message: string;
  timeLabel: string;
  title: string;
  unread: boolean;
};
