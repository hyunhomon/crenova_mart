import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { APP_NAME } from '@/shared/config/app';
import { AppText } from '@/shared/ui/app-text';
import { Screen } from '@/shared/ui/screen';
import { useTheme } from '@/hooks/use-theme';

const categories = ['전체', '응원봉', '앨범', '의류'];
const previewItems = ['오늘 도착', '무료배송', '팬클럽 특가'];

export default function HomePage() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">{APP_NAME}</AppText>
      </View>

      <Pressable
        accessibilityRole="search"
        style={({ pressed }) => [
          styles.searchEntry,
          { backgroundColor: theme.backgroundElement },
          pressed && { opacity: 0.72 },
        ]}>
        <AppText color="textTertiary">상품 검색</AppText>
      </Pressable>

      <View style={styles.chipRow}>
        {categories.map((category, index) => (
          <View
            key={category}
            style={[
              styles.chip,
              {
                backgroundColor: index === 0 ? theme.brandWeak : theme.backgroundElement,
              },
            ]}>
            <AppText color={index === 0 ? 'brand' : 'textSecondary'} variant="caption">
              {category}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.previewList}>
        {previewItems.map((item) => (
          <View
            key={item}
            style={[
              styles.previewRow,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line,
              },
            ]}>
            <AppText variant="title">{item}</AppText>
            <View style={[styles.previewMark, { backgroundColor: theme.brandWeak }]} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
  searchEntry: {
    borderRadius: Radius.md,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.four,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  previewList: {
    gap: Spacing.three,
  },
  previewMark: {
    borderRadius: Radius.full,
    height: 32,
    width: 32,
  },
  previewRow: {
    alignItems: 'center',
    borderRadius: Radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 72,
    padding: Spacing.four,
  },
});
