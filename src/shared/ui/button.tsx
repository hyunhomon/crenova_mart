import { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { Radius, Spacing, ThemeColor } from '@/constants/theme';
import { AppText } from '@/shared/ui/app-text';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'inverted';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  fullWidth?: boolean;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: ButtonVariant;
};

const buttonTone: Record<
  ButtonVariant,
  { background: ThemeColor | 'transparent'; border: ThemeColor | 'transparent'; text: ThemeColor }
> = {
  primary: { background: 'brand', border: 'brand', text: 'surface' },
  secondary: { background: 'backgroundElement', border: 'backgroundElement', text: 'text' },
  ghost: { background: 'transparent', border: 'transparent', text: 'textSecondary' },
  destructive: { background: 'danger', border: 'danger', text: 'surface' },
  inverted: { background: 'text', border: 'text', text: 'background' },
};

const sizeStyle: Record<ButtonSize, ViewStyle> = {
  sm: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
  },
  md: {
    minHeight: 48,
    paddingHorizontal: Spacing.five,
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: Spacing.six,
  },
};

export function Button({
  children,
  disabled,
  fullWidth = false,
  size = 'md',
  style,
  textStyle,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const tone = buttonTone[variant];
  const backgroundColor = tone.background === 'transparent' ? 'transparent' : theme[tone.background];
  const borderColor = tone.border === 'transparent' ? 'transparent' : theme[tone.border];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.root,
        sizeStyle[size],
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...props}>
      <AppText color={tone.text} selectable={false} style={textStyle} variant="label">
        {children}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    alignSelf: 'stretch',
  },
  root: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
  },
});
