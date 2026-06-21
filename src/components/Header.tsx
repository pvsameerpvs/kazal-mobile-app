import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '@/theme';
import { company } from '@/data/mock';
import { Logo } from './Logo';
import { Txt } from './Txt';

/** Branded top header for tab screens: logo + name + profile avatar. */
export function BrandHeader() {
  const router = useRouter();
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandLeft}>
        <Logo size={42} />
        <View style={styles.brandText}>
          <Txt variant="h3">{company.name}</Txt>
          <Txt variant="caption" style={{ color: Colors.cyan }}>
            {company.tagline}
          </Txt>
        </View>
      </View>
      <Pressable style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
        <Ionicons name="person" size={18} color={Colors.textSecondary} />
        <View style={styles.onlineDot} />
      </Pressable>
    </View>
  );
}

/** Minimal top bar for detail/stack screens: back button + optional title. */
export function TopBar({ title, action }: { title?: string; action?: React.ReactNode }) {
  const router = useRouter();
  return (
    <View style={styles.topBar}>
      <Pressable
        style={styles.iconBtn}
        hitSlop={10}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/home'))}
      >
        <Ionicons name="chevron-back" size={22} color={Colors.text} />
      </Pressable>
      {title ? (
        <Txt variant="title" numberOfLines={1} style={styles.topTitle}>
          {title}
        </Txt>
      ) : (
        <View style={styles.flex} />
      )}
      <View style={styles.actionSlot}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  brandLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  brandText: { gap: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { flex: 1 },
  flex: { flex: 1 },
  actionSlot: { minWidth: 40, alignItems: 'flex-end' },
});
