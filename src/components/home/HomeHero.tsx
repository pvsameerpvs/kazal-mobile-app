import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing } from '@/theme';
import { company } from '@/data';
import { Txt } from '../Txt';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 22) return 'Good Evening';
  return 'Good Night';
};

/** Hero image that fills its parent (height animated by the collapsing header). */
export function HomeHero() {
  const router = useRouter();
  const greet = useMemo(greeting, []);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.hero, { paddingTop: insets.top + Spacing.sm }]}>
      <Image
        source={require('@/assets/images/home/home1.jpeg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessibilityLabel="Prime Capital Advisory banner"
      />
      <LinearGradient
        colors={['rgba(43,210,255,0.16)', 'rgba(5,8,15,0.42)', 'rgba(5,8,15,0.60)', Colors.bg]}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.edgeHighlight} />

      <View style={styles.topRow}>
        <View style={styles.greetBlock}>
          <Txt variant="overline" numberOfLines={1}>
            {company.tagline}
          </Txt>
          <Txt variant="h2">{greet}</Txt>
        </View>
        <Pressable style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="person" size={18} color={Colors.textSecondary} />
          <View style={styles.onlineDot} />
        </Pressable>
      </View>

      <View>
        <Txt variant="h1" style={styles.slogan} numberOfLines={1}>
          {company.slogan}
        </Txt>
        <View style={styles.trustRow}>
          <Ionicons name="shield-checkmark" size={13} color={Colors.teal} />
          <Txt variant="caption" style={styles.trust} numberOfLines={1}>
            {company.trust}
          </Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetBlock: { gap: 2, flex: 1, paddingRight: Spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  edgeHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.available,
    borderWidth: 1.5,
    borderColor: Colors.bg,
  },
  slogan: { fontSize: 24, lineHeight: 30 },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  trust: { color: Colors.textSecondary, flex: 1 },
});
