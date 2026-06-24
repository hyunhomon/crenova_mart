import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { APP_NAME } from '@/shared/config/app';
import { AppText, Badge, Card, Screen, SearchField } from '@/shared/ui';
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

      <SearchField editable={false} placeholder="상품 검색" />

      <View style={styles.chipRow}>
        {categories.map((category, index) => (
          <Badge key={category} variant={index === 0 ? 'default' : 'secondary'}>
            {category}
          </Badge>
        ))}
      </View>

      <View style={styles.previewList}>
        {previewItems.map((item) => (
          <Card
            key={item}
            style={styles.previewRow}>
            <AppText variant="title">{item}</AppText>
            <View style={[styles.previewMark, { backgroundColor: theme.brandWeak }]} />
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 72,
  },
});
