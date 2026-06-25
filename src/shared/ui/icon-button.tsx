import { type ComponentType } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconComponent = ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

type IconButtonSize = 'sm' | 'md';

type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  icon: IconComponent;
  showDot?: boolean;
  size?: IconButtonSize;
  style?: StyleProp<ViewStyle>;
};

const iconButtonSize: Record<IconButtonSize, ViewStyle> = {
  md: {
    height: 40,
    width: 40,
  },
  sm: {
    height: 32,
    width: 32,
  },
};

const iconSize: Record<IconButtonSize, number> = {
  md: 22,
  sm: 21,
};

export function IconButton({
  icon: Icon,
  showDot = false,
  size = 'md',
  style,
  ...props
}: IconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={Spacing.two}
      style={({ pressed }) => [
        styles.root,
        iconButtonSize[size],
        pressed && styles.pressed,
        style,
      ]}
      {...props}>
      <Icon color={theme.text} size={iconSize[size]} strokeWidth={2.5} />
      {showDot && <View style={[styles.dot, { backgroundColor: theme.text }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dot: {
    borderCurve: 'continuous',
    borderRadius: Radius.full,
    height: 6,
    position: 'absolute',
    right: 5,
    top: 5,
    width: 6,
  },
  pressed: {
    opacity: 0.72,
  },
  root: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    justifyContent: 'center',
    position: 'relative',
  },
});
