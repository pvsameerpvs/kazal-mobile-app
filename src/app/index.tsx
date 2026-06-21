import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Spacing } from '@/theme';
import { GlowBackground, Logo, Skyline, Txt } from '@/components';
import { company } from '@/data/mock';

export default function Splash() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const enter = () => router.replace('/(tabs)/home');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(enter, 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Pressable style={styles.root} onPress={enter}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />
      <GlowBackground />
      <Skyline height={200} opacity={0.45} />
      <StatusBar style="light" />

      <Animated.View style={[styles.center, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <Animated.View style={[styles.logoRing, { transform: [{ scale }] }]}>
          <Logo size={80} />
        </Animated.View>
        <Txt variant="h1" style={styles.name}>
          {company.name}
        </Txt>
        <View style={styles.divider} />
        <Txt variant="body" style={styles.tagline}>
          {company.tagline}
        </Txt>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fade }]}>
        <View style={styles.trustRow}>
          <Ionicons name="sparkles-outline" size={14} color={Colors.cyan} />
          <Txt variant="caption" style={{ color: Colors.cyan, letterSpacing: 0.5 }}>
            {company.slogan}
          </Txt>
        </View>
        <Txt variant="caption" style={styles.tap}>
          Tap to continue
        </Txt>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', paddingHorizontal: Spacing.xl },
  logoRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    backgroundColor: 'rgba(43,210,255,0.04)',
    marginBottom: Spacing.xxl,
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  name: { letterSpacing: 0.5, textAlign: 'center', fontSize: 30 },
  divider: {
    width: 54,
    height: 3,
    borderRadius: 3,
    backgroundColor: Colors.cyan,
    marginVertical: Spacing.lg,
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  tagline: { color: Colors.textSecondary, textAlign: 'center', fontSize: 13 },
  footer: { position: 'absolute', bottom: 56, alignItems: 'center', gap: Spacing.md },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tap: { color: Colors.textMuted, letterSpacing: 1 },
});
