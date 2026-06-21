import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Radius, Spacing, cardShadow } from '@/theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  /** Highlighted glassy card with cyan-tinted border + glow. */
  accent?: boolean;
  onPress?: () => void;
  radius?: number;
};

/**
 * Soft glassmorphism card: translucent gradient surface, hairline border,
 * and subtle shadow. The building block for the whole UI.
 */
export function GlassCard({ children, style, padded = true, accent = false, onPress, radius = Radius.lg }: Props) {
  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.wrap,
        { borderRadius: radius },
        accent ? styles.accent : styles.plain,
        cardShadow,
        pressed && onPress ? styles.pressed : null,
        style,
      ]}
    >
      <LinearGradient
        colors={accent ? Gradients.ctaSoft : Gradients.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <View style={padded ? styles.padded : undefined}>{children}</View>
    </Container>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  plain: { borderColor: Colors.border, backgroundColor: Colors.glass },
  accent: {
    borderColor: Colors.borderAccent,
    backgroundColor: 'rgba(43,210,255,0.04)',
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.5,
    shadowRadius: 22,
  },
  padded: { padding: Spacing.lg },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
});
