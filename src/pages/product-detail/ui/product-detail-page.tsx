import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { getProductById } from '@/entities/product';
import { ProductOption } from '@/entities/product/model/types';
import { formatKRW } from '@/shared/lib';
import { AppText, Badge, Button, Card, Screen } from '@/shared/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ProductDetailPage() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const product = getProductById(productId);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState(product?.options[0]?.id);

  const selectedOption = useMemo(
    () => product?.options.find((option) => option.id === selectedOptionId),
    [product, selectedOptionId]
  );
  const unitPrice = product ? product.price + (selectedOption?.priceDelta ?? 0) : 0;
  const totalPrice = unitPrice * quantity;

  if (!product) {
    return (
      <Screen>
        <AppText variant="h1">상품이 없어요</AppText>
        <Button variant="secondary" onPress={() => router.replace('/')}>
          홈으로
        </Button>
      </Screen>
    );
  }

  function updateQuantity(nextQuantity: number) {
    setQuantity(Math.max(1, Math.min(99, nextQuantity)));
  }

  function handleBuyNow() {
    router.push('/cart');
  }

  return (
    <Screen contentContainerStyle={styles.content}>
      <Image contentFit="cover" source={product.imageUrl} style={styles.heroImage} />

      <View style={styles.summary}>
        <View style={styles.artistRow}>
          <Badge>{product.delivery.badgeLabel}</Badge>
          <AppText color="textSecondary" variant="caption">
            {product.artist}
          </AppText>
        </View>
        <AppText variant="h1">{product.name}</AppText>
        <AppText variant="title">{formatKRW(unitPrice)}</AppText>
      </View>

      <View style={styles.section}>
        <AppText color="textSecondary" variant="label">
          옵션
        </AppText>
        {product.options.map((option) => (
          <OptionRow
            key={option.id}
            option={option}
            selected={option.id === selectedOptionId}
            onPress={() => setSelectedOptionId(option.id)}
          />
        ))}
      </View>

      <Card style={styles.quantityCard}>
        <AppText variant="label">수량</AppText>
        <View style={styles.quantityControl}>
          <Button size="sm" variant="secondary" onPress={() => updateQuantity(quantity - 1)}>
            -
          </Button>
          <AppText style={styles.quantityText} variant="label">
            {quantity}
          </AppText>
          <Button size="sm" variant="secondary" onPress={() => updateQuantity(quantity + 1)}>
            +
          </Button>
        </View>
      </Card>

      <View style={styles.actionArea}>
        {added && (
          <AppText color="brand" style={styles.addedText} variant="caption">
            장바구니에 담았어요
          </AppText>
        )}
        <View style={styles.actions}>
          <Button
            style={styles.secondaryAction}
            variant="secondary"
            onPress={() => setAdded(true)}>
            장바구니
          </Button>
          <Button fullWidth style={styles.primaryAction} onPress={handleBuyNow}>
            {formatKRW(totalPrice)}
          </Button>
        </View>
      </View>
    </Screen>
  );
}

function OptionRow({
  option,
  onPress,
  selected,
}: {
  option: ProductOption;
  onPress: () => void;
  selected: boolean;
}) {
  const theme = useTheme();

  return (
    <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={onPress}>
      <Card
        style={[
          styles.optionRow,
          selected && {
            borderColor: theme.brand,
          },
        ]}>
        <AppText variant="label">{option.name}</AppText>
        {option.priceDelta > 0 && (
          <AppText color="textSecondary">{formatKRW(option.priceDelta)}</AppText>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionArea: {
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  addedText: {
    textAlign: 'right',
  },
  artistRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  content: {
    gap: Spacing.six,
  },
  heroImage: {
    aspectRatio: 1,
    backgroundColor: '#ECE8FF',
    borderCurve: 'continuous',
    borderRadius: Radius.xxxl,
    width: '100%',
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.72,
  },
  primaryAction: {
    flex: 1,
  },
  quantityCard: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  secondaryAction: {
    minWidth: 104,
  },
  section: {
    gap: Spacing.three,
  },
  summary: {
    gap: Spacing.three,
  },
});
