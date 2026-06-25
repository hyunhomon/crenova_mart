import { Text, type TextProps, type TextStyle } from 'react-native';

import { Fonts, ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AppTextVariant = 'h1' | 'title' | 'body' | 'label' | 'caption';

type AppTextProps = TextProps & {
  color?: ThemeColor;
  variant?: AppTextVariant;
};

const variantFont: Record<AppTextVariant, string> = {
  body: Fonts.sans,
  caption: Fonts.sans,
  h1: Fonts.sansBold,
  label: Fonts.sansSemiBold,
  title: Fonts.sansSemiBold,
};

const variantWeight: Record<AppTextVariant, TextStyle> = {
  body: { fontWeight: '400' },
  caption: { fontWeight: '400' },
  h1: { fontWeight: '700' },
  label: { fontWeight: '600' },
  title: { fontWeight: '600' },
};

export function AppText({
  color = 'text',
  selectable = true,
  style,
  variant = 'body',
  ...props
}: AppTextProps) {
  const theme = useTheme();

  return (
    <Text
      selectable={selectable}
      style={[
        {
          color: theme[color],
          fontFamily: variantFont[variant],
          letterSpacing: 0,
        },
        Typography[variant],
        variantWeight[variant],
        style,
      ]}
      {...props}
    />
  );
}
