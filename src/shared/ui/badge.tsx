import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing, ThemeColor } from '@/constants/theme';
import { AppText } from '@/shared/ui/app-text';
import { useTheme } from '@/hooks/use-theme';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger';

type BadgeProps = ViewProps & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const badgeTone: Record<BadgeVariant, { background: ThemeColor; text: ThemeColor }> = {
  default: { background: 'brandWeak', text: 'brand' },
  secondary: { background: 'backgroundElement', text: 'textSecondary' },
  success: { background: 'backgroundElement', text: 'success' },
  warning: { background: 'backgroundElement', text: 'warning' },
  danger: { background: 'backgroundElement', text: 'danger' },
};

export function Badge({ children, style, variant = 'default', ...props }: BadgeProps) {
  const theme = useTheme();
  const tone = badgeTone[variant];

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme[tone.background],
        },
        style,
      ]}
      {...props}>
      <AppText color={tone.text} variant="caption">
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
});
