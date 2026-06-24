import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { AppText } from '@/shared/ui/app-text';
import { Screen } from '@/shared/ui/screen';
import { useTheme } from '@/hooks/use-theme';

const statuses = ['배송 중', '배송 완료', '완료된 물품'];

export default function OrdersPage() {
  const theme = useTheme();

  return (
    <Screen>
      <AppText variant="h1">주문</AppText>

      <View style={[styles.segmented, { backgroundColor: theme.backgroundElement }]}>
        {statuses.map((status, index) => (
          <View
            key={status}
            style={[
              styles.segment,
              index === 0 && { backgroundColor: theme.surface },
            ]}>
            <AppText color={index === 0 ? 'text' : 'textSecondary'} variant="caption">
              {status}
            </AppText>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.emptyState,
          {
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.line,
          },
        ]}>
        <AppText color="textSecondary">주문 내역이 없어요</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    borderRadius: Radius.xxl,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 180,
    padding: Spacing.six,
  },
  segment: {
    alignItems: 'center',
    borderRadius: Radius.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  segmented: {
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
  },
});
