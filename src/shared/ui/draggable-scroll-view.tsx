import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
} from 'react-native';

import { useDragScroll } from './use-drag-scroll';

export function DraggableScrollView({
  horizontal,
  onScroll,
  scrollEventThrottle = 16,
  style,
  ...props
}: ScrollViewProps) {
  const axis = horizontal ? 'x' : 'y';
  const { dragScrollHandlers, scrollRef, updateDragScrollOffset } = useDragScroll(axis);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    updateDragScrollOffset(event);
    onScroll?.(event);
  }

  return (
    <View style={style} {...dragScrollHandlers}>
      <ScrollView
        ref={scrollRef}
        horizontal={horizontal}
        scrollEventThrottle={scrollEventThrottle}
        style={styles.scroll}
        onScroll={handleScroll}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
});
