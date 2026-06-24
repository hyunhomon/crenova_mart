import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  categoryLabels,
  productCategories,
  ProductCategory,
  searchProducts,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatKRW } from '@/shared/lib';
import { AppText, Button, Card, Screen, SearchField, TextField } from '@/shared/ui';

const GRID_GAP = Spacing.three;
const PRICE_MAX = 90000;
const PRICE_MIN = 0;
const SCREEN_PADDING = Spacing.six;

type PriceRange = {
  max?: number;
  min?: number;
};

type PriceInputValues = {
  max: string;
  min: string;
};

export default function SearchDetailPage() {
  const params = useLocalSearchParams<{
    category?: string;
    maxPrice?: string;
    minPrice?: string;
    query?: string;
  }>();
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const initialCategory = parseCategory(params.category);
  const initialPriceRange = parsePriceRange(params.minPrice, params.maxPrice);
  const query = params.query ?? '';
  const [category, setCategory] = useState<ProductCategory>(initialCategory);
  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState<ProductCategory>(initialCategory);
  const [draftPriceInputs, setDraftPriceInputs] = useState<PriceInputValues>(
    toPriceInputValues(priceRange)
  );
  const products = useMemo(
    () =>
      searchProducts({
        category,
        maxPrice: priceRange.max,
        minPrice: priceRange.min,
        query,
      }),
    [category, priceRange.max, priceRange.min, query]
  );
  const columnCount = 3;
  const boundedWidth = Math.max(width, 320);
  const contentWidth = Math.min(boundedWidth, MaxContentWidth) - SCREEN_PADDING * 2 - Spacing.four;
  const itemWidth = (contentWidth - GRID_GAP * (columnCount - 1)) / columnCount;

  function openFilters() {
    setDraftCategory(category);
    setDraftPriceInputs(toPriceInputValues(priceRange));
    setSheetOpen(true);
  }

  function applyFilters() {
    const nextPriceRange = normalizePriceRange({
      max: parsePriceInput(draftPriceInputs.max),
      min: parsePriceInput(draftPriceInputs.min),
    });
    const nextParams: {
      category: ProductCategory;
      maxPrice?: string;
      minPrice?: string;
      query: string;
    } = {
      category: draftCategory,
      query,
    };

    if (nextPriceRange.max !== undefined) {
      nextParams.maxPrice = String(nextPriceRange.max);
    }

    if (nextPriceRange.min !== undefined) {
      nextParams.minPrice = String(nextPriceRange.min);
    }

    setCategory(draftCategory);
    setPriceRange(nextPriceRange);
    setSheetOpen(false);
    router.replace({
      pathname: '/search-detail/[category]',
      params: nextParams,
    });
  }

  function resetFilters() {
    setDraftCategory('all');
    resetDraftPriceRange();
  }

  function resetDraftPriceRange() {
    setDraftPriceInputs(toPriceInputValues({}));
  }

  function updateDraftPriceInput(field: keyof PriceInputValues, value: string) {
    const nextValue = sanitizePriceInput(value);

    setDraftPriceInputs((current) => ({
      ...current,
      [field]: nextValue,
    }));
  }

  function openSearchHome() {
    router.replace({
      pathname: '/search',
      params: { focus: '1', query },
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <Screen preserveScroll contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={openSearchHome}>
          <SearchField
            editable={false}
            placeholder="상품 검색"
            value={query}
            onPressIn={openSearchHome}
          />
        </Pressable>

        <View style={styles.filterChips}>
          <Button size="sm" variant="secondary" onPress={openFilters}>
            {categoryLabels[category]}
          </Button>
          <Button size="sm" variant="secondary" onPress={openFilters}>
            {formatPriceRange(priceRange)}
          </Button>
        </View>

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

      {sheetOpen && (
        <View style={styles.sheetLayer}>
          <Pressable
            style={[styles.backdrop, { backgroundColor: theme.overlay }]}
            onPress={() => setSheetOpen(false)}
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line,
              },
            ]}>
            <View style={[styles.sheetHandle, { backgroundColor: theme.lineStrong }]} />

            <View style={styles.sheetSection}>
              <AppText color="textSecondary" variant="label">
                카테고리
              </AppText>
              <View style={styles.chipRow}>
                {productCategories.map((item) => (
                  <Button
                    key={item}
                    size="sm"
                    variant={item === draftCategory ? 'inverted' : 'ghost'}
                    onPress={() => setDraftCategory(item)}>
                    {categoryLabels[item]}
                  </Button>
                ))}
              </View>
            </View>

            <View style={styles.sheetSection}>
              <View style={styles.sheetSectionHeader}>
                <AppText color="textSecondary" variant="label">
                  가격 범위
                </AppText>
                <Pressable accessibilityRole="button" onPress={resetDraftPriceRange}>
                  <AppText color="textTertiary" selectable={false} variant="caption">
                    가격 범위 초기화
                  </AppText>
                </Pressable>
              </View>
              <PriceRangeInputs
                maxValue={draftPriceInputs.max}
                minValue={draftPriceInputs.min}
                onMaxChange={(value) => updateDraftPriceInput('max', value)}
                onMinChange={(value) => updateDraftPriceInput('min', value)}
              />
            </View>

            <View style={styles.sheetActions}>
              <Button style={styles.sheetAction} variant="secondary" onPress={resetFilters}>
                초기화
              </Button>
              <Button fullWidth style={styles.sheetApply} variant="inverted" onPress={applyFilters}>
                적용
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function PriceRangeInputs({
  maxValue,
  minValue,
  onMaxChange,
  onMinChange,
}: {
  maxValue: string;
  minValue: string;
  onMaxChange: (value: string) => void;
  onMinChange: (value: string) => void;
}) {
  return (
    <View style={styles.priceInputs}>
      <View style={styles.priceInputGroup}>
        <AppText color="textSecondary" variant="caption">
          최소 가격
        </AppText>
        <TextField
          keyboardType="number-pad"
          placeholder="최소 가격"
          returnKeyType="done"
          style={styles.priceInput}
          value={minValue}
          onChangeText={onMinChange}
        />
      </View>

      <AppText color="textTertiary" style={styles.priceInputSeparator} variant="label">
        ~
      </AppText>

      <View style={styles.priceInputGroup}>
        <AppText color="textSecondary" variant="caption">
          최대 가격
        </AppText>
        <TextField
          keyboardType="number-pad"
          placeholder="최대 가격"
          returnKeyType="done"
          style={styles.priceInput}
          value={maxValue}
          onChangeText={onMaxChange}
        />
      </View>
    </View>
  );
}

function formatPriceRange(range: PriceRange) {
  if (range.min === undefined && range.max === undefined) {
    return '가격 제한 없음';
  }

  if (range.min === undefined) {
    return `${formatKRW(range.max ?? PRICE_MAX)} 이하`;
  }

  if (range.max === undefined) {
    return `${formatKRW(range.min)} 이상`;
  }

  return `${formatKRW(range.min)} - ${formatKRW(range.max)}`;
}

function parseCategory(category?: string): ProductCategory {
  return productCategories.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : 'all';
}

function parsePriceRange(minPrice?: string, maxPrice?: string): PriceRange {
  return normalizePriceRange({
    max: parsePriceParam(maxPrice),
    min: parsePriceParam(minPrice),
  });
}

function parsePriceParam(value: string | undefined) {
  return parsePriceInput(value ?? '');
}

function parsePriceInput(value: string) {
  const sanitized = sanitizePriceInput(value);
  const price = Number(sanitized);

  if (!sanitized || !Number.isFinite(price)) {
    return undefined;
  }

  return clampPrice(price);
}

function normalizePriceRange(range: PriceRange): PriceRange {
  if (range.min === undefined || range.max === undefined) {
    return {
      max: range.max === undefined ? undefined : clampPrice(range.max),
      min: range.min === undefined ? undefined : clampPrice(range.min),
    };
  }

  const min = clampPrice(range.min);
  const max = clampPrice(range.max);

  if (min <= max) {
    return { max, min };
  }

  return { max: min, min: max };
}

function sanitizePriceInput(value: string) {
  return value.replace(/\D/g, '');
}

function clampPrice(value: number) {
  return Math.max(PRICE_MIN, Math.min(PRICE_MAX, Math.round(value)));
}

function toPriceInputValues(range: PriceRange): PriceInputValues {
  return {
    max: range.max === undefined ? '' : String(range.max),
    min: range.min === undefined ? '' : String(range.min),
  };
}

const styles = StyleSheet.create({
  backdrop: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  content: {
    paddingBottom: Spacing.eight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    padding: Spacing.six,
    width: '100%',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  priceInput: {
    fontVariant: ['tabular-nums'],
    minHeight: 48,
    textAlign: 'right',
  },
  priceInputGroup: {
    flex: 1,
    gap: Spacing.two,
  },
  priceInputSeparator: {
    paddingBottom: 14,
  },
  priceInputs: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  results: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  root: {
    flex: 1,
  },
  sheet: {
    alignSelf: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.five,
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    width: '100%',
  },
  sheetAction: {
    minWidth: 104,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  sheetApply: {
    flex: 1,
  },
  sheetHandle: {
    alignSelf: 'center',
    borderRadius: Radius.full,
    height: 4,
    width: 36,
  },
  sheetLayer: {
    bottom: 0,
    justifyContent: 'flex-end',
    left: 0,
    paddingBottom: BottomTabInset + Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sheetSection: {
    gap: Spacing.three,
  },
  sheetSectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
});
