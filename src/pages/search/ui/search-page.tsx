import { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  categoryLabels,
  productCategories,
  ProductCategory,
  ProductSort,
  searchProducts,
  sortLabels,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AppText, Button, Card, Screen, SearchField, SegmentedControl } from '@/shared/ui';

const recentSearches = ['응원봉', '포토카드', '후드'];
const GRID_GAP = Spacing.three;
const SCREEN_PADDING = Spacing.six;
const sortOptions: { label: string; value: ProductSort }[] = [
  { label: sortLabels.recommended, value: 'recommended' },
  { label: sortLabels['price-low'], value: 'price-low' },
  { label: sortLabels['price-high'], value: 'price-high' },
];

export default function SearchPage() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategory>('all');
  const [sort, setSort] = useState<ProductSort>('recommended');
  const products = useMemo(
    () => searchProducts({ category, query, sort }),
    [category, query, sort]
  );
  const columnCount = width < 560 ? 3 : 4;
  const boundedWidth = Math.max(width, 320);
  const contentWidth = Math.min(boundedWidth, MaxContentWidth) - SCREEN_PADDING * 2 - Spacing.four;
  const itemWidth = (contentWidth - GRID_GAP * (columnCount - 1)) / columnCount;

  return (
    <Screen>
      <AppText variant="h1">검색</AppText>

      <SearchField
        placeholder="상품 검색"
        value={query}
        onChangeText={setQuery}
      />

      {!query && (
        <View style={styles.section}>
          <AppText color="textSecondary" variant="label">
            최근 검색어
          </AppText>
          <View style={styles.chipRow}>
            {recentSearches.map((keyword) => (
              <Button
                key={keyword}
                size="sm"
                variant="secondary"
                onPress={() => setQuery(keyword)}>
                {keyword}
              </Button>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <AppText color="textSecondary" variant="label">
          카테고리
        </AppText>
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
      </View>

      <SegmentedControl
        options={sortOptions}
        value={sort}
        onValueChange={(nextSort) => setSort(nextSort as ProductSort)}
      />

      <View style={styles.results}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} style={{ width: itemWidth }} />
          ))
        ) : (
          <Card style={styles.emptyState}>
            <AppText color="textSecondary">검색 결과가 없어요</AppText>
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.three,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    padding: Spacing.six,
  },
  results: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
});
