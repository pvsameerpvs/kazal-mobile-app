/**
 * MET Holdings — Premium dark finance design system.
 *
 * Deep navy / near-black backgrounds, electric cyan + teal glowing accents,
 * subtle gradients and soft glassmorphism. Tokens only — no component logic.
 */

import { Platform, TextStyle } from 'react-native';

export const Colors = {
  // Backgrounds
  bg: '#05080F', // near-black navy base
  bgDeep: '#03050B',
  bgRaised: '#0B1424', // raised navy
  bgElevated: '#101C30',

  // Glass surfaces (translucent)
  glass: 'rgba(255,255,255,0.045)',
  glassStrong: 'rgba(255,255,255,0.08)',
  glassHairline: 'rgba(255,255,255,0.10)',

  // Accents
  cyan: '#2BD2FF', // primary electric cyan
  cyanSoft: '#6FE0FF',
  blue: '#1C7DF0', // deep electric blue
  teal: '#27E0C8', // secondary teal

  // Status
  available: '#34E0A1', // soft green
  limited: '#F5B544', // amber / gold
  sold: '#E06A6A', // muted red
  expired: '#7C879B', // muted slate

  // Text
  text: '#F3F8FF',
  textSecondary: '#9DB0C9',
  textMuted: '#62748F',

  // Lines & glow
  border: 'rgba(255,255,255,0.08)',
  borderAccent: 'rgba(43,210,255,0.28)',
  glowCyan: 'rgba(43,210,255,0.45)',
  glowBlue: 'rgba(28,125,240,0.35)',

  white: '#FFFFFF',
  black: '#000000',
} as const;

/** Brand gradients (use with expo-linear-gradient). */
export const Gradients = {
  screen: ['#070C1A', '#05080F', '#03050B'] as const,
  hero: ['rgba(28,125,240,0.30)', 'rgba(43,210,255,0.06)', 'transparent'] as const,
  cta: ['#2BD2FF', '#1C7DF0'] as const,
  ctaSoft: ['rgba(43,210,255,0.22)', 'rgba(28,125,240,0.10)'] as const,
  teal: ['#27E0C8', '#1C9DF0'] as const,
  card: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.015)'] as const,
  glow: ['rgba(43,210,255,0.20)', 'transparent'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 100,
} as const;

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const Type: Record<string, TextStyle> = {
  display: { fontFamily, fontSize: 38, lineHeight: 42, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  h1: { fontFamily, fontSize: 28, lineHeight: 34, fontWeight: '800', color: Colors.text, letterSpacing: -0.4 },
  h2: { fontFamily, fontSize: 22, lineHeight: 28, fontWeight: '700', color: Colors.text, letterSpacing: -0.3 },
  h3: { fontFamily, fontSize: 18, lineHeight: 24, fontWeight: '700', color: Colors.text, letterSpacing: -0.2 },
  title: { fontFamily, fontSize: 16, lineHeight: 22, fontWeight: '700', color: Colors.text },
  body: { fontFamily, fontSize: 14, lineHeight: 21, fontWeight: '400', color: Colors.textSecondary },
  bodyStrong: { fontFamily, fontSize: 14, lineHeight: 20, fontWeight: '600', color: Colors.text },
  label: { fontFamily, fontSize: 12, lineHeight: 16, fontWeight: '600', color: Colors.textSecondary, letterSpacing: 0.2 },
  caption: { fontFamily, fontSize: 11, lineHeight: 14, fontWeight: '500', color: Colors.textMuted, letterSpacing: 0.3 },
  overline: { fontFamily, fontSize: 11, lineHeight: 14, fontWeight: '700', color: Colors.cyan, letterSpacing: 1.4, textTransform: 'uppercase' },
};

/** Soft cyan glow shadow for premium elevation. */
export const glow = (color: string = Colors.glowCyan, radius = 24) => ({
  shadowColor: color,
  shadowOpacity: 1,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: 0 },
  elevation: 0,
});

export const cardShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.4,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 8,
};
