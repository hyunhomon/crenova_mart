import '@/global.css';

import { Platform } from 'react-native';

export const Brand = {
  name: '팬덤&',
  primary: '#FAFAFA',
} as const;

export const Colors = {
  light: {
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    textQuaternary: '#52525B',
    background: '#09090B',
    backgroundElement: '#18181B',
    backgroundSelected: '#27272A',
    surface: '#111113',
    surfaceMuted: '#18181B',
    line: 'rgba(255, 255, 255, 0.12)',
    lineStrong: '#3F3F46',
    brand: Brand.primary,
    brandPressed: '#E4E4E7',
    brandWeak: '#27272A',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    overlay: 'rgba(0, 0, 0, 0.56)',
    pressOverlay: 'rgba(255, 255, 255, 0.10)',
  },
  dark: {
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    textQuaternary: '#52525B',
    background: '#09090B',
    backgroundElement: '#18181B',
    backgroundSelected: '#27272A',
    surface: '#111113',
    surfaceMuted: '#18181B',
    line: 'rgba(255, 255, 255, 0.12)',
    lineStrong: '#3F3F46',
    brand: Brand.primary,
    brandPressed: '#E4E4E7',
    brandWeak: '#27272A',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    overlay: 'rgba(0, 0, 0, 0.64)',
    pressOverlay: 'rgba(255, 255, 255, 0.10)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'Pretendard-Regular',
    sansSemiBold: 'Pretendard-SemiBold',
    sansBold: 'Pretendard-Bold',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'Pretendard-SemiBold',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Pretendard-Regular',
    sansSemiBold: 'Pretendard-SemiBold',
    sansBold: 'Pretendard-Bold',
    serif: 'serif',
    rounded: 'Pretendard-SemiBold',
    mono: 'monospace',
  },
  web: {
    sans: 'Pretendard',
    sansSemiBold: 'Pretendard',
    sansBold: 'Pretendard',
    serif: 'var(--font-serif)',
    rounded: 'Pretendard-SemiBold',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 28,
  eight: 32,
  ten: 40,
  twelve: 48,
  sixteen: 64,
  twenty: 80,
} as const;

export const Radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 8,
  xl: 8,
  xxl: 12,
  xxxl: 16,
  full: 999,
} as const;

export const Typography = {
  h1: {
    fontSize: 24,
    lineHeight: 32,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 92 }) ?? 0;
export const MaxContentWidth = 640;
