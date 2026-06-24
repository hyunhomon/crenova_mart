import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { formatPaymentMethod } from '@/entities/checkout';
import {
  deliveryStatusSteps,
  getDeliveryStatusLabel,
  isDeliveryStatusReached,
} from '@/entities/order';
import { getProductById } from '@/entities/product';
import { getOrderById, getStatusBadgeVariant } from '@/features/orders/model';
import { formatKRW } from '@/shared/lib';
import { Radius, Spacing } from '@/constants/theme';
import { AppText, Badge, Button, Card, Screen } from '@/shared/ui';

export default function OrderDetailPage() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const order = getOrderById(orderId);
  const status = order?.status;

  if (!order || !status) {
    return (
      <Screen>
        <AppText variant="h1">주문이 없어요</AppText>
        <Button variant="secondary" onPress={() => router.replace('/orders')}>
          주문으로
        </Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Badge variant={getStatusBadgeVariant(status)}>{getDeliveryStatusLabel(status)}</Badge>
        <AppText variant="h1">주문 상세</AppText>
        <AppText color="textSecondary">{order.orderNumber}</AppText>
      </View>

      <Card style={styles.section}>
        <AppText variant="label">배송</AppText>
        <View style={styles.timeline}>
          {deliveryStatusSteps.map((item) => {
            const reached = isDeliveryStatusReached(status, item);
            const current = item === status;

            return (
              <View key={item} style={styles.timelineRow}>
                <View
                  style={[
                    styles.timelineDot,
                    reached && styles.timelineDotReached,
                    current && styles.timelineDotActive,
                  ]}
                />
                <AppText
                  color={reached ? 'text' : 'textSecondary'}
                  variant={current ? 'label' : 'body'}>
                  {getDeliveryStatusLabel(item)}
                </AppText>
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={styles.section}>
        <AppText variant="label">상품</AppText>
        {order.items.map((item) => {
          const product = getProductById(item.productId);

          return (
            <View key={item.id} style={styles.itemRow}>
              {product && (
                <Image contentFit="cover" source={product.imageUrl} style={styles.image} />
              )}
              <View style={styles.itemCopy}>
                <AppText numberOfLines={2} variant="label">
                  {item.productName}
                </AppText>
                <AppText color="textSecondary" variant="caption">
                  {item.quantity}개
                </AppText>
              </View>
              <AppText variant="label">{formatKRW(item.unitPrice * item.quantity)}</AppText>
            </View>
          );
        })}
      </Card>

      <Card style={styles.section}>
        <SummaryRow label="결제금액" value={formatKRW(order.payment.totalAmount)} />
        <SummaryRow label="결제수단" value={formatPaymentMethod(order.payment.method)} />
      </Card>
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
  header: {
    gap: Spacing.three,
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
  itemRow: {
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
  timeline: {
    gap: Spacing.three,
  },
  timelineDot: {
    backgroundColor: '#D9DCE3',
    borderRadius: Radius.full,
    height: 10,
    width: 10,
  },
  timelineDotActive: {
    backgroundColor: '#6D3DFF',
  },
  timelineDotReached: {
    backgroundColor: '#8A909C',
  },
  timelineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
  },
});
