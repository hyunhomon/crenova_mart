import { useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { formatOrderTitle, getDeliveryStatusLabel } from '@/entities/order';
import {
  getOrdersByStatus,
  getStatusBadgeVariant,
  OrderStatusFilter,
  orderStatusOptions,
} from '@/features/orders/model';
import { formatKRW } from '@/shared/lib';
import { Spacing } from '@/constants/theme';
import { AppText, Badge, Card, Screen, SegmentedControl } from '@/shared/ui';

export default function OrdersPage() {
  const [status, setStatus] = useState<OrderStatusFilter>('active');
  const orders = getOrdersByStatus(status);

  return (
    <Screen>
      <AppText variant="h1">주문</AppText>

      <SegmentedControl
        options={orderStatusOptions}
        value={status}
        onValueChange={(nextStatus) => setStatus(nextStatus as OrderStatusFilter)}
      />

      {orders.length > 0 ? (
        <View style={styles.orderList}>
          {orders.map((order) => (
            <Link
              asChild
              key={order.id}
              href={{
                params: { orderId: order.id },
                pathname: '/orders/[orderId]',
              }}>
              <Pressable style={({ pressed }) => pressed && styles.pressed}>
                <Card style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getDeliveryStatusLabel(order.status)}
                    </Badge>
                    <AppText color="textSecondary" variant="caption">
                      {order.orderNumber}
                    </AppText>
                  </View>
                  <AppText numberOfLines={2} variant="label">
                    {formatOrderTitle(order.items)}
                  </AppText>
                  <View style={styles.orderFooter}>
                    <AppText color="textSecondary">{order.items.length}건</AppText>
                    <AppText variant="label">{formatKRW(order.payment.totalAmount)}</AppText>
                  </View>
                </Card>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : (
        <Card style={styles.emptyState}>
          <AppText color="textSecondary">주문 내역이 없어요</AppText>
        </Card>
      )}
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
  orderCard: {
    gap: Spacing.three,
  },
  orderFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  orderList: {
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.72,
  },
});
