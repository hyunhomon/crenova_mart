import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { AppText } from '@/shared/ui/app-text';
import { Screen } from '@/shared/ui/screen';
import { useTheme } from '@/hooks/use-theme';

const recentSearches = ['응원봉', '포토카드', '후드'];

export default function SearchPage() {
  const theme = useTheme();

  return (
    <Screen>
      <AppText variant="h1">검색</AppText>

      <Pressable
        accessibilityRole="search"
        style={({ pressed }) => [
          styles.searchField,
          { backgroundColor: theme.backgroundElement },
          pressed && { opacity: 0.72 },
        ]}>
        <AppText color="textTertiary">상품 검색</AppText>
      </Pressable>

      <View style={styles.section}>
        <AppText color="textSecondary" variant="label">
          최근 검색어
        </AppText>
        <View style={styles.chipRow}>
          {recentSearches.map((keyword) => (
            <View
              key={keyword}
              style={[styles.chip, { backgroundColor: theme.backgroundElement }]}>
              <AppText color="textSecondary" variant="caption">
                {keyword}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  searchField: {
    borderRadius: Radius.md,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.four,
  },
  section: {
    gap: Spacing.three,
  },
});
