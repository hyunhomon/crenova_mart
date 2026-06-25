import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { AppText, Card, Screen } from '@/shared/ui';

export default function CartPage() {
  return (
    <Screen>
      <AppText variant="h1">장바구니</AppText>

      <Card style={styles.emptyState}>
        <AppText color="textSecondary">담은 상품이 없어요</AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    padding: Spacing.six,
  },
});
