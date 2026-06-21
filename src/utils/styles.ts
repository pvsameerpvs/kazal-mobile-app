import { StyleSheet, ViewStyle } from 'react-native';

export function glassBorder(borderColor: string): ViewStyle {
  return {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor,
  };
}

export function glowRing(
  color: string,
  radius: number,
  bg?: string,
): ViewStyle {
  return {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color,
    backgroundColor: bg ?? 'transparent',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: color,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  };
}
