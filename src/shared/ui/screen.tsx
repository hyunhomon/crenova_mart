import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDragScroll } from './use-drag-scroll';

type ScreenProps = ScrollViewProps & {
  preserveScroll?: boolean;
};

export function Screen({
  contentContainerStyle,
  onScroll,
  preserveScroll = false,
  scrollEventThrottle = 16,
  showsVerticalScrollIndicator = false,
  style,
  ...props
}: ScreenProps) {
  const theme = useTheme();
  const { dragScrollHandlers, scrollRef, updateDragScrollOffset } = useDragScroll('y');

  useFocusEffect(
    useCallback(() => {
      if (preserveScroll) {
        return;
      }

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ animated: false, y: 0 });
      });
    }, [preserveScroll, scrollRef])
  );

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    updateDragScrollOffset(event);
    onScroll?.(event);
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }, style]} {...dragScrollHandlers}>
      <ScrollView
        ref={scrollRef}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onScroll={handleScroll}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
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
