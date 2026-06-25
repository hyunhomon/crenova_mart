import { router } from 'expo-router';
import { CreditCard, PackageCheck, X } from 'lucide-react-native';
import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { mockNotifications, NotificationKind } from '@/entities/notification';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppText, Card, IconButton, Screen } from '@/shared/ui';

const notificationIcon: Record<NotificationKind, ComponentType<{ color?: string; size?: number }>> =
  {
    delivery: PackageCheck,
    payment: CreditCard,
  };

export default function NotificationsPage() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.topBar}>
        <AppText variant="h1">알림</AppText>
        <IconButton
          accessibilityLabel="닫기"
          icon={X}
          size="sm"
          onPress={() => router.replace('/')}
        />
      </View>

      <View style={styles.list}>
        {mockNotifications.map((notification) => {
          const Icon = notificationIcon[notification.kind];

          return (
            <Card key={notification.id} style={styles.notificationCard} variant="ghost">
              <View style={[styles.iconBox, { backgroundColor: theme.backgroundElement }]}>
                <Icon color={theme.text} size={20} />
              </View>
              <View style={styles.copy}>
                <AppText variant="label">{notification.title}</AppText>
                <AppText color="textSecondary">{notification.description}</AppText>
                <AppText color="textTertiary" variant="caption">
                  {notification.timeLabel}
                </AppText>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
  iconBox: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  list: {
    gap: Spacing.one,
  },
  notificationCard: {
    alignItems: 'flex-start',
    borderWidth: 0,
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: 0,
    paddingVertical: Spacing.three,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
