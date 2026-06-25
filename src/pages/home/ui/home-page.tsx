import { useState } from 'react';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  categoryLabels,
  getProductsByCategory,
  productCategories,
  ProductCategory,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AppText, Button, DraggableScrollView, IconButton, Screen } from '@/shared/ui';

const GRID_GAP = Spacing.three;
const SCREEN_PADDING = Spacing.six;

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
      <View style={styles.topBar}>
        <AppText variant="h1">팬덤&</AppText>
        <IconButton
          accessibilityLabel="알림"
          icon={Bell}
          showDot
          size="sm"
          onPress={() => router.push('/notifications')}
        />
      </View>

      <DraggableScrollView
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
      </DraggableScrollView>

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
    paddingHorizontal: SCREEN_PADDING,
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
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
