import { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  categoryLabels,
  getProductsByCategory,
  productCategories,
  ProductCategory,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AppText, Button, Screen } from '@/shared/ui';

const GRID_GAP = Spacing.three;
const SCREEN_PADDING = Spacing.four;

export default function HomePage() {
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState<ProductCategory>('all');
  const products = getProductsByCategory(category);
  const columnCount = 3;
  const boundedWidth = Math.max(width, 320);
  const contentWidth = Math.min(boundedWidth, MaxContentWidth) - SCREEN_PADDING * 2 - Spacing.four;
  const itemWidth = (contentWidth - GRID_GAP * (columnCount - 1)) / columnCount;

  return (
    <Screen preserveScroll contentContainerStyle={styles.content}>
      <AppText variant="h1">팬덤&</AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.railContent}
        style={styles.rail}>
        {productCategories.map((item) => (
          <Button
            key={item}
            size="sm"
            style={styles.railTab}
            variant={item === category ? 'inverted' : 'ghost'}
            onPress={() => setCategory(item)}>
            {categoryLabels[item]}
          </Button>
        ))}
      </ScrollView>

      <View style={styles.feed}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} style={{ width: itemWidth }} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: Spacing.three,
  },
  feed: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  rail: {
    marginHorizontal: -SCREEN_PADDING,
  },
  railContent: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: SCREEN_PADDING,
  },
  railTab: {
    minHeight: 36,
  },
});
