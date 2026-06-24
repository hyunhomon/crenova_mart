import { StyleSheet, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import { AppText, Card, Screen } from '@/shared/ui';

const profileRows = [
  ['이름', 'hyu'],
  ['등급', '팬덤& 와우'],
  ['찜한 상품', '12개'],
  ['배송지', '서울시 강남구'],
] as const;

export default function ProfilePage() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">프로필</AppText>
        <AppText color="textSecondary">{Brand.name}</AppText>
      </View>

      <Card style={styles.card}>
        {profileRows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <AppText color="textSecondary">{label}</AppText>
            <AppText variant="label">{value}</AppText>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.two,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
