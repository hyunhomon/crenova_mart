import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppText, Button, Card, Screen } from '@/shared/ui';
import { Spacing } from '@/constants/theme';

type PaymentFailParams = {
  code?: string;
  message?: string;
};

export default function PaymentFailPage() {
  const { code } = useLocalSearchParams<PaymentFailParams>();

  return (
    <Screen>
      <AppText variant="h1">결제 실패</AppText>
      <Card style={styles.section}>
        <AppText color="textSecondary">{getFailMessage(code)}</AppText>
      </Card>
      <Button fullWidth onPress={() => router.replace('/checkout')}>
        다시 결제하기
      </Button>
      <Button fullWidth variant="secondary" onPress={() => router.replace('/cart')}>
        장바구니로
      </Button>
    </Screen>
  );
}

function getFailMessage(code?: string) {
  if (code === 'USER_CANCEL' || code === 'PAY_PROCESS_CANCELED') {
    return '취소됐어요';
  }

  return '다시 시도해 주세요';
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
});
