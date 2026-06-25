import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useCart } from '@/features/cart/model';
import {
  buildPaymentOrderName,
  startMockPayment,
} from '@/features/payment/mock/model';
import { formatKRW } from '@/shared/lib';
import { Radius, Spacing } from '@/constants/theme';
import { AppText, Button, Card, Screen } from '@/shared/ui';

const shippingAddress = {
  addressLine1: '서울특별시 강남구 테헤란로 152',
  addressLine2: '팬덤빌딩 8층',
  name: '김팬덤',
  phone: '010-0000-0000',
};

export default function CheckoutPage() {
  const cart = useCart();

  if (!cart.isReady) {
    return (
      <Screen>
        <AppText variant="h1">주문서</AppText>
        <Card style={styles.emptyState}>
          <AppText color="textSecondary">장바구니를 불러오고 있어요</AppText>
        </Card>
      </Screen>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Screen>
        <AppText variant="h1">주문서</AppText>
        <Card style={styles.emptyState}>
          <AppText color="textSecondary">주문할 상품이 없어요</AppText>
          <Button variant="secondary" onPress={() => router.replace('/')}>
            상품 보기
          </Button>
        </Card>
      </Screen>
    );
  }

  function handleRequestPayment() {
    startMockPayment({
      amount: cart.summary.total,
      items: cart.items,
      orderName: buildPaymentOrderName(cart.items),
    });
  }

  return (
    <Screen>
      <AppText variant="h1">주문서</AppText>

      <Card style={styles.section}>
        <AppText variant="label">배송지</AppText>
        <View style={styles.address}>
          <AppText variant="label">{shippingAddress.name}</AppText>
          <AppText color="textSecondary">{shippingAddress.phone}</AppText>
          <AppText color="textSecondary">
            {shippingAddress.addressLine1} {shippingAddress.addressLine2}
          </AppText>
        </View>
      </Card>

      <Card style={styles.section}>
        <AppText variant="label">상품</AppText>
        {cart.items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Image contentFit="cover" source={item.product.imageUrl} style={styles.image} />
            <View style={styles.itemCopy}>
              <AppText numberOfLines={2} variant="label">
                {item.product.name}
              </AppText>
              <AppText color="textSecondary" variant="caption">
                {item.quantity}개
              </AppText>
            </View>
            <AppText variant="label">{formatKRW(item.unitPrice * item.quantity)}</AppText>
          </View>
        ))}
      </Card>

      <Card style={styles.section}>
        <SummaryRow label="상품금액" value={formatKRW(cart.summary.subtotal)} />
        <SummaryRow label="배송비" value={formatKRW(cart.summary.deliveryFee)} />
        <View style={styles.divider} />
        <SummaryRow strong label="결제금액" value={formatKRW(cart.summary.total)} />
      </Card>

      <Button fullWidth size="lg" onPress={handleRequestPayment}>
        결제하기
      </Button>
    </Screen>
  );
}

function SummaryRow({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <AppText color={strong ? 'text' : 'textSecondary'} variant={strong ? 'label' : 'body'}>
        {label}
      </AppText>
      <AppText variant={strong ? 'title' : 'label'}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  address: {
    gap: Spacing.one,
  },
  divider: {
    backgroundColor: 'rgba(138, 144, 156, 0.24)',
    height: 1,
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.four,
    justifyContent: 'center',
    minHeight: 180,
    padding: Spacing.six,
  },
  image: {
    aspectRatio: 1,
    borderRadius: Radius.md,
    width: 56,
  },
  itemCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  orderItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.three,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
