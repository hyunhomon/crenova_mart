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
import { AppText } from '@/shared/ui';
import { Radius, Spacing } from '@/constants/theme';

type ProductCardProps = {
  product: Product;
  style?: StyleProp<ViewStyle>;
};

export function ProductCard({ product, style }: ProductCardProps) {
  return (
    <View style={style}>
      <Link
        asChild
        href={{
          params: { productId: product.id },
          pathname: '/product/[productId]',
        }}>
        <Pressable style={({ pressed }) => [styles.root, pressed && styles.pressed]}>
          <Image contentFit="cover" source={product.imageUrl} style={styles.image} />
          <View style={styles.copy}>
            <AppText numberOfLines={2} style={styles.title} variant="body">
              {product.name}
            </AppText>
            <AppText style={styles.price} variant="label">
              {formatKRW(product.price)}
            </AppText>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    gap: Spacing.one,
  },
  image: {
    aspectRatio: 0.74,
    backgroundColor: '#ECE8FF',
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
    gap: Spacing.two,
    width: '100%',
  },
  title: {
    fontSize: 14,
    lineHeight: 19,
  },
});
