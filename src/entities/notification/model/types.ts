export type NotificationKind = 'delivery' | 'payment';

export type NotificationItem = {
  description: string;
  id: string;
  kind: NotificationKind;
  timeLabel: string;
  title: string;
};
