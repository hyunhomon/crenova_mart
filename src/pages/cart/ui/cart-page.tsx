import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { AppText } from '@/shared/ui/app-text';
import { Screen } from '@/shared/ui/screen';
import { useTheme } from '@/hooks/use-theme';

export default function CartPage() {
  const theme = useTheme();

  return (
    <Screen>
      <AppText variant="h1">장바구니</AppText>

      <View
        style={[
          styles.emptyState,
          {
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.line,
          },
        ]}>
        <AppText color="textSecondary">담은 상품이 없어요</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    borderRadius: Radius.xxl,
    borderWidth: 1,
    minHeight: 180,
    justifyContent: 'center',
    padding: Spacing.six,
  },
});
