import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { AppText, Card, Screen, SegmentedControl } from '@/shared/ui';

const statuses = [
  { label: '배송 중', value: 'shipping' },
  { label: '배송 완료', value: 'delivered' },
  { label: '완료된 물품', value: 'completed' },
] as const;

export default function OrdersPage() {
  const [status, setStatus] = useState<string>(statuses[0].value);

  return (
    <Screen>
      <AppText variant="h1">주문</AppText>

      <SegmentedControl options={statuses} value={status} onValueChange={setStatus} />

      <Card style={styles.emptyState}>
        <AppText color="textSecondary">주문 내역이 없어요</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    padding: Spacing.six,
  },
});
