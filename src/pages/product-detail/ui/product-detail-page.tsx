import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, ChevronDown } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { getProductById, getRelatedProducts } from '@/entities/product';
import { ProductOption } from '@/entities/product/model/types';
import { ProductCard } from '@/entities/product/ui';
import { useCart } from '@/features/cart/model';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatKRW } from '@/shared/lib';
import { AppText, Badge, Button, Card, Screen } from '@/shared/ui';

const PURCHASE_BAR_SPACE = 156;

export default function ProductDetailPage() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const product = getProductById(productId);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState(product?.options[0]?.id);
  const cart = useCart();
  const theme = useTheme();

  const selectedOption = useMemo(
    () => product?.options.find((option) => option.id === selectedOptionId) ?? product?.options[0],
    [product, selectedOptionId]
  );
  const relatedProducts = useMemo(
    () => (product ? getRelatedProducts(product.id, 8) : []),
    [product]
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

  const selectedOptionIdForCart = selectedOption?.id;
  const productIdForCart = product.id;

  function updateQuantity(nextQuantity: number) {
    setQuantity(Math.max(1, Math.min(99, nextQuantity)));
  }

  function handleBuyNow() {
    if (!selectedOptionIdForCart) {
      return;
    }

    cart.addItem({
      optionId: selectedOptionIdForCart,
      productId: productIdForCart,
      quantity,
    });
    router.push('/checkout');
  }

  function handleAddToCart() {
    if (!selectedOptionIdForCart) {
      return;
    }

    cart.addItem({
      optionId: selectedOptionIdForCart,
      productId: productIdForCart,
      quantity,
    });
    setAdded(true);
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <Screen contentContainerStyle={[styles.content, { paddingBottom: PURCHASE_BAR_SPACE }]}>
        <Image contentFit="cover" source={product.imageUrl} style={styles.heroImage} />

        <View style={styles.summary}>
          <View style={styles.deliveryRow}>
            <Badge>{product.delivery.badgeLabel}</Badge>
          </View>
          <AppText variant="h1">{product.name}</AppText>
          <AppText color="textTertiary" variant="caption">
            판매자 {product.artist}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText color="textSecondary" variant="label">
            옵션
          </AppText>
          <OptionDropdown
            options={product.options}
            selectedOptionId={selectedOption?.id}
            onSelect={setSelectedOptionId}
          />
        </View>

        <View style={styles.section}>
          <AppText color="textSecondary" variant="label">
            상품 설명
          </AppText>
          <AppText color="textSecondary">{product.description}</AppText>
        </View>

        <View style={styles.section}>
          <AppText color="textSecondary" variant="label">
            다른 상품
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedList}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                style={styles.relatedCard}
              />
            ))}
          </ScrollView>
        </View>
      </Screen>

      <View
        style={[
          styles.purchaseBar,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.line,
          },
        ]}>
        <View style={styles.purchaseContent}>
          {added && (
            <AppText color="textSecondary" style={styles.purchaseNotice} variant="caption">
              장바구니에 담았어요
            </AppText>
          )}
          <View style={styles.purchaseTopRow}>
            <AppText color="textSecondary" variant="label">
              수량
            </AppText>
            <View style={styles.quantityControl}>
              <Button
                disabled={quantity === 1}
                size="sm"
                variant="secondary"
                onPress={() => updateQuantity(quantity - 1)}>
                -
              </Button>
              <AppText style={styles.quantityText} variant="label">
                {quantity}
              </AppText>
              <Button size="sm" variant="secondary" onPress={() => updateQuantity(quantity + 1)}>
                +
              </Button>
            </View>
          </View>
          <View style={styles.actions}>
            <Button style={styles.secondaryAction} variant="secondary" onPress={handleAddToCart}>
              장바구니
            </Button>
            <Button fullWidth style={styles.primaryAction} variant="inverted" onPress={handleBuyNow}>
              {formatKRW(totalPrice)}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

function OptionDropdown({
  onSelect,
  options,
  selectedOptionId,
}: {
  onSelect: (optionId: string) => void;
  options: ProductOption[];
  selectedOptionId?: string;
}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const selectedOption = options.find((option) => option.id === selectedOptionId) ?? options[0];

  return (
    <View style={styles.dropdownRoot}>
      <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={() => setOpen(!open)}>
        <Card
          style={[
            styles.optionTrigger,
            open && {
              borderColor: theme.lineStrong,
            },
          ]}
          variant="muted">
          <View>
            <AppText variant="label">{selectedOption?.name ?? '옵션 선택'}</AppText>
            {!!selectedOption?.priceDelta && (
              <AppText color="textSecondary" variant="caption">
                +{formatKRW(selectedOption.priceDelta)}
              </AppText>
            )}
          </View>
          <View style={[styles.dropdownIcon, open && styles.dropdownIconOpen]}>
            <ChevronDown color={theme.textSecondary} size={18} strokeWidth={2.4} />
          </View>
        </Card>
      </Pressable>

      {open && (
        <Card padded={false} style={styles.optionMenu} variant="muted">
          {options.map((option, index) => {
            const selected = option.id === selectedOption?.id;

            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.optionMenuItem,
                  index > 0 && {
                    borderTopColor: theme.line,
                    borderTopWidth: StyleSheet.hairlineWidth,
                  },
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  onSelect(option.id);
                  setOpen(false);
                }}>
                <View style={styles.optionMenuCopy}>
                  <AppText variant="label">{option.name}</AppText>
                  {option.priceDelta > 0 && (
                    <AppText color="textSecondary" variant="caption">
                      +{formatKRW(option.priceDelta)}
                    </AppText>
                  )}
                </View>
                {selected && <Check color={theme.text} size={16} strokeWidth={2.6} />}
              </Pressable>
            );
          })}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  content: {
    gap: Spacing.six,
  },
  deliveryRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropdownIcon: {
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  dropdownIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownRoot: {
    gap: Spacing.two,
  },
  heroImage: {
    aspectRatio: 1,
    backgroundColor: '#ECE8FF',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    width: '100%',
  },
  optionMenu: {
    gap: 0,
    overflow: 'hidden',
  },
  optionMenuCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  optionMenuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  optionTrigger: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  pressed: {
    opacity: 0.72,
  },
  primaryAction: {
    flex: 1,
  },
  purchaseBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    left: 0,
    paddingTop: Spacing.three,
    position: 'absolute',
    right: 0,
  },
  purchaseContent: {
    alignSelf: 'center',
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.six,
    width: '100%',
  },
  purchaseNotice: {
    textAlign: 'right',
  },
  purchaseTopRow: {
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
  relatedCard: {
    width: 128,
  },
  relatedList: {
    gap: Spacing.three,
    paddingRight: Spacing.six,
  },
  root: {
    flex: 1,
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
