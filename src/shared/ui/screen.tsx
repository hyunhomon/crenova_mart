import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = ScrollViewProps & {
  preserveScroll?: boolean;
};

export function Screen({
  contentContainerStyle,
  preserveScroll = false,
  showsVerticalScrollIndicator = false,
  style,
  ...props
}: ScreenProps) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      if (preserveScroll) {
        return;
      }

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ animated: false, y: 0 });
      });
    }, [preserveScroll])
  );

  return (
    <ScrollView
      ref={scrollRef}
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.root, { backgroundColor: theme.background }, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
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
