import { Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AppTextVariant = 'h1' | 'title' | 'body' | 'label' | 'caption';

type AppTextProps = TextProps & {
  color?: ThemeColor;
  variant?: AppTextVariant;
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
          fontFamily: Fonts.sans,
          letterSpacing: 0,
        },
        Typography[variant],
        style,
      ]}
      {...props}
    />
  );
}
