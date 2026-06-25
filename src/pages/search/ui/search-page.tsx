import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View, type TextInput } from 'react-native';

import {
  categoryLabels,
  productCategories,
  ProductCategory,
  searchProducts,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import {
  addRecentSearch,
  defaultRecentSearches,
  loadSearchPreferences,
  saveSearchDraftQuery,
} from '@/features/search/model';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AppText, Button, Screen, SearchField } from '@/shared/ui';

const GRID_GAP = Spacing.three;
const RECOMMENDED_PRODUCT_LIMIT = 12;
const SCREEN_PADDING = Spacing.six;

export default function SearchPage() {
  const params = useLocalSearchParams<{ focus?: string; query?: string }>();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState(params.query ?? '');
  const [recentSearches, setRecentSearches] = useState(defaultRecentSearches);
  const searchInputRef = useRef<TextInput>(null);
  const products = useMemo(
    () => searchProducts({ category: 'all', query: '' }).slice(0, RECOMMENDED_PRODUCT_LIMIT),
    []
  );
  const columnCount = 3;
  const boundedWidth = Math.max(width, 320);
  const contentWidth = Math.min(boundedWidth, MaxContentWidth) - SCREEN_PADDING * 2 - Spacing.four;
  const itemWidth = (contentWidth - GRID_GAP * (columnCount - 1)) / columnCount;

  useFocusEffect(
    useCallback(() => {
      if (params.focus !== '1') {
        return;
      }

      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }, [params.focus])
  );

  useEffect(() => {
    let mounted = true;

    loadSearchPreferences()
      .then((preferences) => {
        if (!mounted) {
          return;
        }

        setRecentSearches(preferences.recentSearches);

        if (!params.query) {
          setQuery(preferences.draftQuery);
        }
      })
      .catch((error) => {
        console.error('Failed to load search preferences.', error);
      });

    return () => {
      mounted = false;
    };
  }, [params.query]);

  useEffect(() => {
    if (params.query === undefined) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      setQuery(params.query ?? '');
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [params.query]);

  async function openSearchDetail(nextCategory: ProductCategory, nextQuery = query) {
    await recordSearch(nextQuery);

    router.push({
      pathname: '/search-detail/[category]',
      params: {
        category: nextCategory,
        query: nextQuery,
      },
    });
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    router.setParams({ query: nextQuery });
    void saveSearchDraftQuery(nextQuery);
  }

  async function recordSearch(nextQuery: string) {
    const preferences = await addRecentSearch(nextQuery);

    setRecentSearches(preferences.recentSearches);
  }

  return (
    <Screen preserveScroll>
      <SearchField
        ref={searchInputRef}
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
            <Button key={item} size="sm" variant="ghost" onPress={() => openSearchDetail(item)}>
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
