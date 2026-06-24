import { useState } from 'react';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  categoryLabels,
  getProductsByCategory,
  productCategories,
  ProductCategory,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { APP_NAME } from '@/shared/config/app';
import { AppText, Screen } from '@/shared/ui';
import { useTheme } from '@/hooks/use-theme';

const GRID_GAP = Spacing.three;
const SCREEN_PADDING = Spacing.four;

export default function HomePage() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const [category, setCategory] = useState<ProductCategory>('all');
  const products = getProductsByCategory(category);
  const columnCount = width < 560 ? 3 : 4;
  const boundedWidth = Math.max(width, 320);
  const contentWidth = Math.min(boundedWidth, MaxContentWidth) - SCREEN_PADDING * 2 - Spacing.four;
  const itemWidth = (contentWidth - GRID_GAP * (columnCount - 1)) / columnCount;

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText selectable={false} style={styles.brand} variant="h1">
          {APP_NAME}
        </AppText>
        <Link href="/search" asChild>
          <Pressable
            accessibilityLabel="검색"
            style={({ pressed }) => [
              styles.searchButton,
              { borderColor: theme.line },
              pressed && styles.pressed,
            ]}>
            <SymbolView
              name={{ android: 'search', ios: 'magnifyingglass', web: 'search' }}
              size={24}
              tintColor={theme.text}
            />
          </Pressable>
        </Link>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.railContent}
        style={styles.rail}>
        {productCategories.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.railTab,
              item === category && {
                borderBottomColor: theme.brand,
              },
            ]}
            onPress={() => setCategory(item)}>
            <AppText
              color={item === category ? 'text' : 'textTertiary'}
              selectable={false}
              variant="label">
              {categoryLabels[item]}
            </AppText>
          </Pressable>
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
  brand: {
    fontSize: 30,
    lineHeight: 38,
  },
  content: {
    gap: Spacing.four,
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: Spacing.five,
  },
  feed: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.72,
  },
  rail: {
    marginHorizontal: -SCREEN_PADDING,
  },
  railContent: {
    flexDirection: 'row',
    gap: Spacing.five,
    paddingHorizontal: SCREEN_PADDING,
  },
  railTab: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    minHeight: 44,
    justifyContent: 'center',
  },
  searchButton: {
    alignItems: 'center',
    aspectRatio: 1,
    borderCurve: 'continuous',
    borderRadius: Radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    width: 44,
  },
});
