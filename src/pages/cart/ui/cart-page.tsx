import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useCart } from '@/features/cart/model';
import { formatKRW } from '@/shared/lib';
import { Radius, Spacing } from '@/constants/theme';
import { AppText, Button, Card, Screen } from '@/shared/ui';

export default function CartPage() {
  const cart = useCart();

  return (
    <Screen>
      <AppText variant="h1">장바구니</AppText>

      {!cart.isReady ? (
        <Card style={styles.emptyState}>
          <AppText color="textSecondary">장바구니를 불러오고 있어요</AppText>
        </Card>
      ) : cart.items.length === 0 ? (
        <Card style={styles.emptyState}>
          <AppText color="textSecondary">담은 상품이 없어요</AppText>
          <Button variant="secondary" onPress={() => router.replace('/')}>
            상품 보기
          </Button>
        </Card>
      ) : (
        <>
          <View style={styles.list}>
            {cart.items.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [pressed && styles.pressed]}
                onPress={() =>
                  router.push(`/product/${encodeURIComponent(item.product.id)}` as never)
                }>
                <Card style={styles.cartItem}>
                  <Image contentFit="cover" source={item.product.imageUrl} style={styles.image} />
                  <View style={styles.itemCopy}>
                    <AppText numberOfLines={2} variant="label">
                      {item.product.name}
                    </AppText>
                    <AppText color="textSecondary" variant="caption">
                      {item.product.options.find((option) => option.id === item.optionId)?.name}
                    </AppText>
                    <AppText variant="label">{formatKRW(item.unitPrice)}</AppText>
                    <View style={styles.itemActions}>
                      <View style={styles.quantityControl}>
                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={(event) => {
                            event.stopPropagation();
                            cart.updateQuantity(item.id, item.quantity - 1);
                          }}>
                          -
                        </Button>
                        <AppText style={styles.quantityText} variant="label">
                          {item.quantity}
                        </AppText>
                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={(event) => {
                            event.stopPropagation();
                            cart.updateQuantity(item.id, item.quantity + 1);
                          }}>
                          +
                        </Button>
                      </View>
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={(event) => {
                          event.stopPropagation();
                          cart.removeItem(item.id);
                        }}>
                        삭제
                      </Button>
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>

          <Card style={styles.summary}>
            <SummaryRow label="상품금액" value={formatKRW(cart.summary.subtotal)} />
            <SummaryRow label="배송비" value={formatKRW(cart.summary.deliveryFee)} />
            <View style={styles.divider} />
            <SummaryRow strong label="총 결제금액" value={formatKRW(cart.summary.total)} />
          </Card>

          <Button fullWidth size="lg" onPress={() => router.push('/checkout')}>
            구매하기
          </Button>
        </>
      )}
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
  cartItem: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: Spacing.four,
  },
  divider: {
    backgroundColor: 'rgba(138, 144, 156, 0.24)',
    height: 1,
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.four,
    minHeight: 180,
    justifyContent: 'center',
    padding: Spacing.six,
  },
  image: {
    borderRadius: Radius.lg,
    minHeight: 96,
    width: 88,
  },
  itemActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemCopy: {
    flex: 1,
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.72,
  },
  quantityControl: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quantityText: {
    fontVariant: ['tabular-nums'],
    minWidth: 28,
    textAlign: 'center',
  },
  summary: {
    gap: Spacing.three,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
