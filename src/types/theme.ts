import type { TextStyle } from 'react-native';

export type ThemeColors = typeof import('@/theme').Colors;
export type ThemeGradients = typeof import('@/theme').Gradients;
export type ThemeSpacing = typeof import('@/theme').Spacing;
export type ThemeRadius = typeof import('@/theme').Radius;
export type TypographyVariant = keyof typeof import('@/theme').Type;

export type ThemeContextValue = {
  colors: ThemeColors;
  gradients: ThemeGradients;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  type: Record<TypographyVariant, TextStyle>;
  glow: typeof import('@/theme').glow;
  cardShadow: typeof import('@/theme').cardShadow;
};
