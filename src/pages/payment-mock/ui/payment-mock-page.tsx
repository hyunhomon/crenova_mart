import { router } from 'expo-router';
import { Check, CreditCard, ShieldCheck, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  createMockTransactionId,
  getCachedPendingMockPayment,
  getPendingMockPayment,
  PendingMockPayment,
} from '@/features/payment/mock/model';
import { formatKRW } from '@/shared/lib';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppText, Button, Card, IconButton } from '@/shared/ui';

type PaymentState =
  | {
      payment: PendingMockPayment;
      status: 'ready';
    }
  | {
      message?: string;
      status: 'error' | 'loading';
    };

const paymentMethod = '국민카드 **** 1234';

export default function PaymentMockPage() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const hasSubmittedRef = useRef(false);
  const [paymentState, setPaymentState] = useState<PaymentState>(() => {
    const cachedPayment = getCachedPendingMockPayment();

    return cachedPayment ? { payment: cachedPayment, status: 'ready' } : { status: 'loading' };
  });
  const [isAgreed, setAgreed] = useState(true);

  useEffect(() => {
    if (paymentState.status === 'ready') {
      return;
    }

    let isMounted = true;

    async function loadPayment() {
      const payment = await getPendingMockPayment();

      if (!isMounted) {
        return;
      }

      if (!payment) {
        setPaymentState({ message: '결제 정보를 다시 불러와 주세요', status: 'error' });
        return;
      }

      setPaymentState({ payment, status: 'ready' });
    }

    void loadPayment();

    return () => {
      isMounted = false;
    };
  }, [paymentState.status]);

  const title = useMemo(() => {
    if (paymentState.status !== 'ready') {
      return '';
    }

    return paymentState.payment.orderName;
  }, [paymentState]);

  function cancelPayment() {
    router.replace('/checkout/fail?code=USER_CANCEL' as never);
  }

  function completePayment() {
    if (paymentState.status !== 'ready' || !isAgreed || hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = true;

    const transactionId = createMockTransactionId(paymentState.payment.orderId);
    const params = new URLSearchParams({
      amount: String(paymentState.payment.amount),
      orderId: paymentState.payment.orderId,
      transactionId,
    });

    router.replace(`/checkout/success?${params.toString()}` as never);
  }

  if (paymentState.status !== 'ready') {
    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: theme.background,
            paddingBottom: insets.bottom + Spacing.four,
            paddingTop: insets.top,
          },
        ]}>
        <View style={styles.header}>
          <AppText variant="title">결제</AppText>
          <IconButton accessibilityLabel="닫기" icon={X} onPress={cancelPayment} />
        </View>
        <View style={styles.messageArea}>
          <Card style={styles.section}>
            <AppText variant="label">
              {paymentState.status === 'loading' ? '결제 준비 중' : '결제창을 열지 못했어요'}
            </AppText>
            <AppText color="textSecondary">
              {paymentState.status === 'loading' ? '잠시만 기다려 주세요' : paymentState.message}
            </AppText>
          </Card>
          {paymentState.status === 'error' && (
            <Button fullWidth variant="secondary" onPress={() => router.replace('/checkout')}>
              주문서로
            </Button>
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.background,
          paddingBottom: insets.bottom + Spacing.four,
          paddingTop: insets.top,
        },
      ]}>
      <View style={styles.header}>
        <AppText variant="title">결제</AppText>
        <IconButton accessibilityLabel="닫기" icon={X} onPress={cancelPayment} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountBlock}>
          <AppText color="textSecondary" variant="caption">
            팬덤&
          </AppText>
          <AppText numberOfLines={2} variant="title">
            {title}
          </AppText>
          <AppText style={styles.amount} variant="h1">
            {formatKRW(paymentState.payment.amount)}
          </AppText>
        </View>

        <Card style={styles.section}>
          <PaymentRow icon={CreditCard} label="결제수단" value={paymentMethod} />
          <View style={[styles.divider, { backgroundColor: theme.line }]} />
          <PaymentRow icon={ShieldCheck} label="보안" value="테스트 결제" />
        </Card>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isAgreed }}
          style={({ pressed }) => [
            styles.agreement,
            { backgroundColor: theme.backgroundElement },
            pressed && styles.pressed,
          ]}
          onPress={() => setAgreed((current) => !current)}>
          <View
            style={[
              styles.check,
              {
                backgroundColor: isAgreed ? theme.text : theme.backgroundSelected,
              },
            ]}>
            {isAgreed && <Check color={theme.background} size={16} strokeWidth={3} />}
          </View>
          <AppText variant="label">결제 진행 동의</AppText>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Button
          fullWidth
          disabled={!isAgreed}
          size="lg"
          variant="inverted"
          onPress={completePayment}>
          {`${formatKRW(paymentState.payment.amount)} 결제하기`}
        </Button>
      </View>
    </View>
  );
}

function PaymentRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
}) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: theme.backgroundSelected }]}>
        <Icon color={theme.text} size={18} strokeWidth={2.5} />
      </View>
      <View style={styles.rowText}>
        <AppText color="textSecondary" variant="caption">
          {label}
        </AppText>
        <AppText variant="label">{value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  agreement: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 56,
    paddingHorizontal: Spacing.four,
  },
  amount: {
    marginTop: Spacing.two,
  },
  amountBlock: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  check: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.full,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  content: {
    flex: 1,
    gap: Spacing.four,
    padding: Spacing.six,
  },
  divider: {
    height: 1,
  },
  footer: {
    paddingHorizontal: Spacing.six,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: Spacing.four,
  },
  messageArea: {
    flex: 1,
    gap: Spacing.four,
    justifyContent: 'center',
    padding: Spacing.six,
  },
  pressed: {
    opacity: 0.72,
  },
  root: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  rowIcon: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  rowText: {
    flex: 1,
    gap: Spacing.half,
  },
  section: {
    gap: Spacing.three,
  },
});
