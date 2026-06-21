import { createContext, ReactNode } from 'react';
import { Colors, Gradients, Spacing, Radius, Type, glow, cardShadow } from '@/theme';

export type ThemeContextValue = {
  colors: typeof Colors;
  gradients: typeof Gradients;
  spacing: typeof Spacing;
  radius: typeof Radius;
  type: typeof Type;
  glow: typeof glow;
  cardShadow: typeof cardShadow;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = { children: ReactNode };

export function ThemeProvider({ children }: Props) {
  const value: ThemeContextValue = {
    colors: Colors,
    gradients: Gradients,
    spacing: Spacing,
    radius: Radius,
    type: Type,
    glow,
    cardShadow,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
