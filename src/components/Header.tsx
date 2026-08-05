import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '@/theme';
import { Txt } from './Txt';

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
