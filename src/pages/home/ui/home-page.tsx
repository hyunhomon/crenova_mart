import { StyleSheet, View } from 'react-native';

import { featuredProducts } from '@/entities/product';
import { formatKRW } from '@/shared/lib';
import { Spacing } from '@/constants/theme';
import { APP_NAME } from '@/shared/config/app';
import { AppText, Badge, Card, Screen, SearchField } from '@/shared/ui';

const categories = ['전체', '응원봉', '앨범', '의류'];

export default function HomePage() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">{APP_NAME}</AppText>
      </View>

      <SearchField editable={false} placeholder="상품 검색" />

      <View style={styles.chipRow}>
        {categories.map((category, index) => (
          <Badge key={category} variant={index === 0 ? 'default' : 'secondary'}>
            {category}
          </Badge>
        ))}
      </View>

      <View style={styles.previewList}>
        {featuredProducts.map((product) => (
          <Card
            key={product.id}
            style={styles.previewRow}>
            <View style={styles.productCopy}>
              <AppText numberOfLines={2} variant="title">
                {product.name}
              </AppText>
              <AppText color="textSecondary">{formatKRW(product.price)}</AppText>
            </View>
            <Badge>{product.delivery.badgeLabel}</Badge>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  previewList: {
    gap: Spacing.three,
  },
  productCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  previewRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    minHeight: 72,
  },
});
