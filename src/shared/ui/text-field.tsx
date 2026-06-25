import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
} from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function TextField({ onBlur, onFocus, style, ...props }: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const theme = useTheme();

  function handleFocus(event: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) {
    setFocused(false);
    onBlur?.(event);
  }

  return (
    <TextInput
      placeholderTextColor={theme.textTertiary}
      selectionColor={theme.brand}
      style={[
        styles.root,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: focused ? theme.brand : theme.line,
          color: theme.text,
        },
        style,
      ]}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}

export function SearchField(props: TextInputProps) {
  return (
    <TextField
      autoCapitalize="none"
      returnKeyType="search"
      textContentType="none"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 48,
    paddingHorizontal: Spacing.four,
  },
});
