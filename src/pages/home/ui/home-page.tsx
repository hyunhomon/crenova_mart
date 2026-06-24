import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  categoryLabels,
  getProductsByCategory,
  productCategories,
  ProductCategory,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import { Spacing } from '@/constants/theme';
import { APP_NAME } from '@/shared/config/app';
import { AppText, Button, Screen, SearchField } from '@/shared/ui';

export default function HomePage() {
  const [category, setCategory] = useState<ProductCategory>('all');
  const products = getProductsByCategory(category);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">{APP_NAME}</AppText>
      </View>

      <SearchField editable={false} placeholder="상품 검색" />

      <View style={styles.chipRow}>
        {productCategories.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={item === category ? 'primary' : 'secondary'}
            onPress={() => setCategory(item)}>
            {categoryLabels[item]}
          </Button>
        ))}
      </View>

      <View style={styles.previewList}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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
});
