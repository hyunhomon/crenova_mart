import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = ScrollViewProps;

export function Screen({ contentContainerStyle, style, ...props }: ScreenProps) {
  const theme = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.root, { backgroundColor: theme.background }, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    gap: Spacing.six,
    maxWidth: MaxContentWidth,
    paddingBottom: BottomTabInset + Spacing.eight,
    paddingHorizontal: Spacing.six,
    paddingTop: Spacing.six,
    width: '100%',
  },
});
