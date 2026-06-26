import { Image } from 'expo-image';
import { Link } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { Product } from '@/entities/product/model/types';
import { formatKRW } from '@/shared/lib';
import { AppText, Card, CardContent } from '@/shared/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProductCardProps = {
  product: Product;
  style?: StyleProp<ViewStyle>;
};

export function ProductCard({ product, style }: ProductCardProps) {
  const theme = useTheme();

  return (
    <View style={style}>
      <Link
        asChild
        href={`/product/${encodeURIComponent(product.id)}` as never}>
        <Pressable style={({ pressed }) => [styles.root, pressed && styles.pressed]}>
          <Card padded={false} style={styles.card} variant="ghost">
            <Image
              contentFit="cover"
              source={product.imageUrl}
              style={[styles.image, { backgroundColor: theme.brandWeak }]}
            />
            <CardContent style={styles.copy}>
              <AppText numberOfLines={2} variant="caption">
                {product.name}
              </AppText>
              <AppText style={styles.price} variant="label">
                {formatKRW(product.price)}
              </AppText>
            </CardContent>
          </Card>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  copy: {
    gap: Spacing.one,
  },
  image: {
    aspectRatio: 0.74,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    width: '100%',
  },
  price: {
    fontVariant: ['tabular-nums'],
  },
  pressed: {
    opacity: 0.72,
  },
  root: {
    width: '100%',
  },
});
