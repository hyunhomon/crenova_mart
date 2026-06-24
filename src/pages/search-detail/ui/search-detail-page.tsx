import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type GestureResponderEvent,
} from 'react-native';

import {
  categoryLabels,
  productCategories,
  ProductCategory,
  searchProducts,
} from '@/entities/product';
import { ProductCard } from '@/entities/product/ui';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatKRW } from '@/shared/lib';
import { AppText, Button, Card, Screen, SearchField } from '@/shared/ui';

const GRID_GAP = Spacing.three;
const PRICE_MAX = 90000;
const PRICE_MIN = 0;
const PRICE_STEP = 5000;
const RANGE_HANDLE_SIZE = 22;
const SCREEN_PADDING = Spacing.six;

type PriceRange = {
  max: number;
  min: number;
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
  const [query, setQuery] = useState(params.query ?? '');
  const [category, setCategory] = useState<ProductCategory>(initialCategory);
  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState<ProductCategory>(initialCategory);
  const [draftPriceRange, setDraftPriceRange] = useState<PriceRange>(priceRange);
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
    setDraftPriceRange(priceRange);
    setSheetOpen(true);
  }

  function applyFilters() {
    setCategory(draftCategory);
    setPriceRange(draftPriceRange);
    setSheetOpen(false);
    router.replace({
      pathname: '/search-detail/[category]',
      params: {
        category: draftCategory,
        maxPrice: String(draftPriceRange.max),
        minPrice: String(draftPriceRange.min),
        query,
      },
    });
  }

  function resetFilters() {
    setDraftCategory('all');
    setDraftPriceRange({ max: PRICE_MAX, min: PRICE_MIN });
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <Screen preserveScroll contentContainerStyle={styles.content}>
        <SearchField placeholder="상품 검색" value={query} onChangeText={setQuery} />

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
              <AppText color="textSecondary" variant="label">
                가격 범위
              </AppText>
              <PriceRangeBar range={draftPriceRange} onChange={setDraftPriceRange} />
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

function PriceRangeBar({
  onChange,
  range,
}: {
  onChange: (range: PriceRange) => void;
  range: PriceRange;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const theme = useTheme();
  const minOffset = valueToOffset(range.min, trackWidth);
  const maxOffset = valueToOffset(range.max, trackWidth);

  function updateRange(event: GestureResponderEvent) {
    if (!Number.isFinite(trackWidth) || trackWidth <= 0) {
      return;
    }

    const locationX = getPressLocationX(event);

    if (locationX === null) {
      return;
    }

    const clampedLocationX = Math.max(0, Math.min(trackWidth, locationX));
    const nextValue = snapPrice(
      PRICE_MIN + (clampedLocationX / trackWidth) * (PRICE_MAX - PRICE_MIN)
    );
    const shouldMoveMin = Math.abs(nextValue - range.min) <= Math.abs(nextValue - range.max);

    if (shouldMoveMin) {
      onChange({
        max: range.max,
        min: Math.min(nextValue, range.max - PRICE_STEP),
      });
      return;
    }

    onChange({
      max: Math.max(nextValue, range.min + PRICE_STEP),
      min: range.min,
    });
  }

  return (
    <View style={styles.priceRange}>
      <View style={styles.priceValues}>
        <AppText style={styles.priceValueText} variant="label">
          {formatKRW(range.min)}
        </AppText>
        <AppText style={styles.priceValueText} variant="label">
          {formatKRW(range.max)}
        </AppText>
      </View>

      <Pressable
        style={styles.rangeTrack}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;

          if (Number.isFinite(width) && width > 0) {
            setTrackWidth(width);
          }
        }}
        onPress={updateRange}>
        <View
          pointerEvents="none"
          style={[styles.rangeRail, { backgroundColor: theme.backgroundSelected }]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.rangeSelected,
            {
              backgroundColor: theme.text,
              left: minOffset,
              width: Math.max(maxOffset - minOffset, 0),
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.rangeHandle,
            {
              backgroundColor: theme.text,
              left: minOffset - RANGE_HANDLE_SIZE / 2,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.rangeHandle,
            {
              backgroundColor: theme.text,
              left: maxOffset - RANGE_HANDLE_SIZE / 2,
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

type WebPressEventShape = GestureResponderEvent['nativeEvent'] & {
  clientX?: number;
  offsetX?: number;
  target?: unknown;
};

type WebTargetShape = {
  getBoundingClientRect?: () => {
    left: number;
  };
};

function formatPriceRange(range: PriceRange) {
  return `${formatKRW(range.min)} - ${formatKRW(range.max)}`;
}

function parseCategory(category?: string): ProductCategory {
  return productCategories.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : 'all';
}

function parsePriceRange(minPrice?: string, maxPrice?: string): PriceRange {
  const min = parsePriceParam(minPrice, PRICE_MIN);
  const max = parsePriceParam(maxPrice, PRICE_MAX);

  if (max - min < PRICE_STEP) {
    return { max: PRICE_MAX, min: PRICE_MIN };
  }

  return { max, min };
}

function parsePriceParam(value: string | undefined, fallback: number) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return fallback;
  }

  return snapPrice(price);
}

function snapPrice(value: number) {
  const snapped = Math.round(value / PRICE_STEP) * PRICE_STEP;

  return Math.max(PRICE_MIN, Math.min(PRICE_MAX, snapped));
}

function getPressLocationX(event: GestureResponderEvent) {
  const nativeEvent = event.nativeEvent as WebPressEventShape;
  const directLocationX = getFiniteNumber(nativeEvent.locationX) ?? getFiniteNumber(nativeEvent.offsetX);

  if (directLocationX !== null) {
    return directLocationX;
  }

  const pageX = getFiniteNumber(nativeEvent.pageX) ?? getFiniteNumber(nativeEvent.clientX);
  const currentTarget = toWebTarget((event as { currentTarget?: unknown }).currentTarget);
  const target = currentTarget ?? toWebTarget(nativeEvent.target);
  const left = getFiniteNumber(target?.getBoundingClientRect?.().left);

  if (pageX === null || left === null) {
    return null;
  }

  return pageX - left;
}

function getFiniteNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toWebTarget(target: unknown): WebTargetShape | null {
  if (typeof target !== 'object' || target === null || !('getBoundingClientRect' in target)) {
    return null;
  }

  return target as WebTargetShape;
}

function valueToOffset(value: number, trackWidth: number) {
  if (!Number.isFinite(trackWidth) || trackWidth <= 0) {
    return 0;
  }

  return ((value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * trackWidth;
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
  priceRange: {
    gap: Spacing.two,
  },
  priceValues: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceValueText: {
    fontVariant: ['tabular-nums'],
  },
  rangeHandle: {
    borderCurve: 'continuous',
    borderRadius: Radius.full,
    height: RANGE_HANDLE_SIZE,
    position: 'absolute',
    top: 9,
    width: RANGE_HANDLE_SIZE,
  },
  rangeRail: {
    borderRadius: Radius.full,
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 18,
  },
  rangeSelected: {
    borderRadius: Radius.full,
    height: 4,
    position: 'absolute',
    top: 18,
  },
  rangeTrack: {
    height: 40,
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
    padding: Spacing.four,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sheetSection: {
    gap: Spacing.three,
  },
});
