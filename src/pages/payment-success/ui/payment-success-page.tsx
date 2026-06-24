import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { resolveTossPaymentSuccess, TossPaymentSuccessParams } from '@/features/payment/toss/model';
import { formatKRW } from '@/shared/lib';
import { AppText, Button, Card, Screen } from '@/shared/ui';
import { Spacing } from '@/constants/theme';

export default function PaymentSuccessPage() {
  const params = useLocalSearchParams<TossPaymentSuccessParams>();
  const result = useMemo(() => resolveTossPaymentSuccess(params), [params]);

  if (!result.isValid || !result.order) {
    return (
      <Screen>
        <AppText variant="h1">결제 확인 필요</AppText>
        <Card style={styles.section}>
          <AppText color="textSecondary">금액을 확인하지 못했어요</AppText>
        </Card>
        <Button variant="secondary" onPress={() => router.replace('/cart')}>
          장바구니로
        </Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="h1">결제 완료</AppText>
      <Card style={styles.section}>
        <SummaryRow label="주문번호" value={result.order.orderNumber} />
        <SummaryRow label="결제금액" value={formatKRW(result.order.payment.totalAmount)} />
      </Card>
      <Button fullWidth size="lg" onPress={() => router.replace('/orders')}>
        주문 보기
      </Button>
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <AppText color="textSecondary">{label}</AppText>
      <AppText variant="label">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
});
