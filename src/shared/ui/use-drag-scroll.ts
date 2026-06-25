import { useCallback, useMemo, useRef } from 'react';
import {
  PanResponder,
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
} from 'react-native';

type DragAxis = 'x' | 'y';

type DragStart = {
  scrollX: number;
  scrollY: number;
};

export function useDragScroll(axis: DragAxis, enabled = true) {
  const scrollRef = useRef<ScrollView>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef<DragStart | null>(null);
  const enabledOnWeb = process.env.EXPO_OS === 'web' && enabled;
  const panResponder = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_event, gestureState) => {
          if (!enabledOnWeb) {
            return false;
          }

          const primaryDelta = axis === 'x' ? Math.abs(gestureState.dx) : Math.abs(gestureState.dy);
          const secondaryDelta =
            axis === 'x' ? Math.abs(gestureState.dy) : Math.abs(gestureState.dx);

          return primaryDelta > 8 && primaryDelta > secondaryDelta;
        },
        onPanResponderGrant: () => {
          dragStartRef.current = {
            scrollX: offsetRef.current.x,
            scrollY: offsetRef.current.y,
          };
        },
        onPanResponderMove: (_event, gestureState) => {
          if (!enabledOnWeb || !dragStartRef.current) {
            return;
          }

          const delta = axis === 'x' ? gestureState.dx : gestureState.dy;
          const startOffset =
            axis === 'x' ? dragStartRef.current.scrollX : dragStartRef.current.scrollY;
          const nextOffset = Math.max(0, startOffset - delta);

          if (axis === 'x') {
            scrollRef.current?.scrollTo({ animated: false, x: nextOffset });
            return;
          }

          scrollRef.current?.scrollTo({ animated: false, y: nextOffset });
        },
        onPanResponderRelease: () => {
          dragStartRef.current = null;
        },
        onPanResponderTerminate: () => {
          dragStartRef.current = null;
        },
      }),
    [axis, enabledOnWeb]
  );

  const updateDragScrollOffset = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      offsetRef.current = event.nativeEvent.contentOffset;
    },
    []
  );

  const dragScrollHandlers: Partial<ScrollViewProps> = enabledOnWeb
    ? panResponder.panHandlers
    : {};

  return {
    dragScrollHandlers,
    scrollRef,
    updateDragScrollOffset,
  };
}
