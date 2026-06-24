import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { AppText, Badge, Screen, SearchField } from '@/shared/ui';

const recentSearches = ['응원봉', '포토카드', '후드'];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <Screen>
      <AppText variant="h1">검색</AppText>

      <SearchField
        placeholder="상품 검색"
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.section}>
        <AppText color="textSecondary" variant="label">
          최근 검색어
        </AppText>
        <View style={styles.chipRow}>
          {recentSearches.map((keyword) => (
            <Badge key={keyword} variant="secondary">
              {keyword}
            </Badge>
          ))}
        </View>
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
});
