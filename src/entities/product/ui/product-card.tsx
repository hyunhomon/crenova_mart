import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Product } from '@/entities/product/model/types';
import { formatKRW } from '@/shared/lib';
import { AppText, Badge, Card } from '@/shared/ui';
import { Radius, Spacing } from '@/constants/theme';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      asChild
      href={{
        params: { productId: product.id },
        pathname: '/product/[productId]',
      }}>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <Card style={styles.card}>
          <Image contentFit="cover" source={product.imageUrl} style={styles.image} />
          <View style={styles.copy}>
            <View style={styles.header}>
              <AppText color="textSecondary" numberOfLines={1} variant="caption">
                {product.artist}
              </AppText>
              <AppText numberOfLines={2} variant="title">
                {product.name}
              </AppText>
            </View>
            <View style={styles.footer}>
              <AppText variant="label">{formatKRW(product.price)}</AppText>
              <Badge>{product.delivery.badgeLabel}</Badge>
            </View>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.four,
  },
  copy: {
    flex: 1,
    gap: Spacing.four,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  header: {
    gap: Spacing.one,
  },
  image: {
    aspectRatio: 1,
    backgroundColor: '#ECE8FF',
    borderRadius: Radius.lg,
    width: 92,
  },
  pressed: {
    opacity: 0.72,
  },
});
