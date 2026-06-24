import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  categoryLabels,
  productCategories,
  ProductCategory,
  searchProducts,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AppText, Button, Screen, SearchField } from '@/shared/ui';

const recentSearches = ['응원봉', '포토카드', '후드'];
const GRID_GAP = Spacing.three;
const RECOMMENDED_PRODUCT_LIMIT = 12;
const SCREEN_PADDING = Spacing.six;

export default function SearchPage() {
  const params = useLocalSearchParams<{ query?: string }>();
  const { width } = useWindowDimensions();
  const query = params.query ?? '';
  const products = useMemo(
    () => searchProducts({ category: 'all', query: '' }).slice(0, RECOMMENDED_PRODUCT_LIMIT),
    []
  );
  const columnCount = 3;
  const boundedWidth = Math.max(width, 320);
  const contentWidth = Math.min(boundedWidth, MaxContentWidth) - SCREEN_PADDING * 2 - Spacing.four;
  const itemWidth = (contentWidth - GRID_GAP * (columnCount - 1)) / columnCount;

  function openSearchDetail(nextCategory: ProductCategory, nextQuery = query) {
    router.push({
      pathname: '/search-detail/[category]',
      params: {
        category: nextCategory,
        query: nextQuery,
      },
    });
  }

  function updateQuery(nextQuery: string) {
    router.setParams({ query: nextQuery });
  }

  return (
    <Screen preserveScroll>
      <SearchField
        placeholder="상품 검색"
        value={query}
        onChangeText={updateQuery}
        onSubmitEditing={() => openSearchDetail('all')}
      />

      <View style={styles.section}>
        <AppText color="textSecondary" variant="label">
          최근 검색어
        </AppText>
        <View style={styles.chipRow}>
          {recentSearches.map((keyword) => (
            <Button
              key={keyword}
              size="sm"
              variant="ghost"
              onPress={() => {
                updateQuery(keyword);
                openSearchDetail('all', keyword);
              }}>
              {keyword}
            </Button>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText color="textSecondary" variant="label">
          카테고리
        </AppText>
        <View style={styles.chipRow}>
          {productCategories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant="ghost"
              onPress={() => openSearchDetail(item)}>
              {categoryLabels[item]}
            </Button>
          ))}
        </View>
      </View>

      <AppText color="textSecondary" variant="label">
        추천 상품
      </AppText>

      <View style={styles.results}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} style={{ width: itemWidth }} />
        ))}
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
  results: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
});
