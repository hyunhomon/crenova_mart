import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { mockNotifications, NotificationKind } from '@/entities/notification';
import { Spacing } from '@/constants/theme';
import { AppText, Badge, Card, IconButton, Screen } from '@/shared/ui';

const notificationKindLabel: Record<NotificationKind, string> = {
  cart: '장바구니',
  delivery: '배송',
  event: '추천',
  order: '주문',
};

const notificationKindVariant = {
  cart: 'secondary',
  delivery: 'success',
  event: 'default',
  order: 'warning',
} as const;

export default function NotificationsPage() {
  return (
    <Screen>
      <View style={styles.topBar}>
        <IconButton
          accessibilityLabel="뒤로"
          icon={ChevronLeft}
          size="sm"
          onPress={() => router.back()}
        />
        <AppText style={styles.title} variant="h1">
          알림
        </AppText>
        <View style={styles.topBarSpacer} />
      </View>

      <View style={styles.list}>
        {mockNotifications.map((notification) => (
          <Card
            key={notification.id}
            style={[styles.notificationCard, notification.unread && styles.unreadCard]}
            variant={notification.unread ? 'muted' : 'ghost'}>
            <View style={styles.cardHeader}>
              <Badge variant={notificationKindVariant[notification.kind]}>
                {notificationKindLabel[notification.kind]}
              </Badge>
              <AppText color="textTertiary" variant="caption">
                {notification.timeLabel}
              </AppText>
            </View>
            <View style={styles.copy}>
              <AppText variant="label">{notification.title}</AppText>
              <AppText color="textSecondary">{notification.message}</AppText>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copy: {
    gap: Spacing.one,
  },
  list: {
    gap: Spacing.three,
  },
  notificationCard: {
    gap: Spacing.three,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  topBarSpacer: {
    height: 32,
    width: 32,
  },
  unreadCard: {
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
});
