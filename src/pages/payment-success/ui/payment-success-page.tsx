import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Order } from '@/entities/order';
import { useCart } from '@/features/cart/model';
import { useOrders } from '@/features/orders/model';
import { MockPaymentSuccessParams, resolveMockPaymentSuccess } from '@/features/payment/mock/model';
import { Spacing } from '@/constants/theme';
import { formatKRW } from '@/shared/lib';
import { AppText, Button, Card, Screen } from '@/shared/ui';

type PaymentResolution =
  | {
      isValid: false;
      order: null;
    }
  | {
      isValid: true;
      order: Order;
    };

const copy = {
  amount: '\uacb0\uc81c\uae08\uc561',
  cart: '\uc7a5\ubc14\uad6c\ub2c8\ub85c',
  checkingDescription: '\uacb0\uc81c \uc815\ubcf4\ub97c \ud655\uc778\ud558\uace0 \uc788\uc5b4\uc694',
  checkingTitle: '\uacb0\uc81c \ud655\uc778 \uc911',
  completeTitle: '\uacb0\uc81c \uc644\ub8cc',
  invalidDescription: '\uae08\uc561\uc744 \ud655\uc778\ud558\uc9c0 \ubabb\ud588\uc5b4\uc694',
  invalidTitle: '\uacb0\uc81c \ud655\uc778 \ud544\uc694',
  orderNumber: '\uc8fc\ubb38\ubc88\ud638',
  viewOrders: '\uc8fc\ubb38 \ubcf4\uae30',
};

export default function PaymentSuccessPage() {
  const params = useLocalSearchParams<MockPaymentSuccessParams>();
  const cart = useCart();
  const orders = useOrders();
  const [result, setResult] = useState<PaymentResolution | null>(null);
  const hasResolvedRef = useRef(false);

  useEffect(() => {
    if (!cart.isReady || !orders.isReady || hasResolvedRef.current) {
      return;
    }

    hasResolvedRef.current = true;

    async function resolvePayment() {
      const nextResult = await resolveMockPaymentSuccess(params);

      if (nextResult.isValid && nextResult.order) {
        setResult(nextResult as PaymentResolution);

        runWhenIdle(() => {
          void orders.addOrder(nextResult.order).catch((error) => {
            console.error('Failed to save paid order.', error);
          });
          cart.clearCart();
        });
        return;
      }

      setResult(nextResult as PaymentResolution);
    }

    void resolvePayment();
  }, [cart, orders, params]);

  if (!result) {
    return (
      <Screen>
        <AppText variant="h1">{copy.checkingTitle}</AppText>
        <Card style={styles.section}>
          <AppText color="textSecondary">{copy.checkingDescription}</AppText>
        </Card>
      </Screen>
    );
  }

  if (!result.isValid || !result.order) {
    return (
      <Screen>
        <AppText variant="h1">{copy.invalidTitle}</AppText>
        <Card style={styles.section}>
          <AppText color="textSecondary">{copy.invalidDescription}</AppText>
        </Card>
        <Button variant="secondary" onPress={() => router.replace('/cart')}>
          {copy.cart}
        </Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="h1">{copy.completeTitle}</AppText>
      <Card style={styles.section}>
        <SummaryRow label={copy.orderNumber} value={result.order.orderNumber} />
        <SummaryRow label={copy.amount} value={formatKRW(result.order.payment.totalAmount)} />
      </Card>
      <Button fullWidth size="lg" onPress={() => router.replace('/orders')}>
        {copy.viewOrders}
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

function runWhenIdle(task: () => void) {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(task);
    return;
  }

  setTimeout(task, 0);
}
