import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = ViewProps & {
  children: ReactNode;
  padded?: boolean;
};

export function Card({ children, padded = true, style, ...props }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.surface,
          borderColor: theme.line,
        },
        padded && styles.padded,
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  header: {
    gap: Spacing.one,
  },
  padded: {
    padding: Spacing.four,
  },
  root: {
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: Spacing.four,
  },
});
