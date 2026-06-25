import '@/global.css';

import { Platform } from 'react-native';

export const Brand = {
  name: '팬덤&',
  primary: '#6D3DFF',
} as const;

export const Colors = {
  light: {
    text: '#252730',
    textSecondary: '#5D6370',
    textTertiary: '#8A909C',
    textQuaternary: '#B8BDC7',
    background: '#FFFFFF',
    backgroundElement: '#F4F5F8',
    backgroundSelected: '#ECE8FF',
    surface: '#FFFFFF',
    surfaceMuted: '#F8F8FA',
    line: 'rgba(37, 39, 48, 0.08)',
    lineStrong: '#D9DCE3',
    brand: Brand.primary,
    brandPressed: '#5730D6',
    brandWeak: '#F1ECFF',
    success: '#0A8F58',
    warning: '#F58A1F',
    danger: '#E04444',
    overlay: 'rgba(0, 0, 0, 0.56)',
    pressOverlay: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    text: '#F7F7FA',
    textSecondary: '#C0C4CC',
    textTertiary: '#8F96A3',
    textQuaternary: '#626978',
    background: '#111216',
    backgroundElement: '#1D1F26',
    backgroundSelected: '#2B2447',
    surface: '#171920',
    surfaceMuted: '#1D1F26',
    line: 'rgba(255, 255, 255, 0.10)',
    lineStrong: '#3A3F4B',
    brand: '#8B6BFF',
    brandPressed: '#7654EF',
    brandWeak: '#251D43',
    success: '#33B979',
    warning: '#FFAA45',
    danger: '#FF6B6B',
    overlay: 'rgba(0, 0, 0, 0.64)',
    pressOverlay: 'rgba(255, 255, 255, 0.10)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
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
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 999,
} as const;

export const Typography = {
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 700,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 600,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 400,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 600,
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: 500,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 640;
