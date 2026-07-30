import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/theme';
import { Txt } from '@/components';

export function ChatHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable style={styles.back} hitSlop={10} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={Colors.text} />
      </Pressable>

      <View style={styles.avatar}>
        <Ionicons name="headset-outline" size={20} color={Colors.cyan} />
        <View style={styles.onlineDot} />
      </View>

      <View style={styles.info}>
        <Txt variant="title" numberOfLines={1}>Advisory Team</Txt>
        <Txt variant="caption" style={{ color: Colors.available, fontSize: 12 }}>
          Online
        </Txt>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} hitSlop={8}>
          <Ionicons name="call-outline" size={22} color={Colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.actionBtn} hitSlop={8}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: 'rgba(5,8,15,0.98)',
  },
  back: {
    width: 40, height: 40, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 2,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(43,210,255,0.10)',
    borderWidth: 1, borderColor: Colors.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: Colors.available,
    borderWidth: 2.5, borderColor: Colors.bg,
  },
  info: { flex: 1, marginLeft: Spacing.xs, gap: 1 },
  actions: { flexDirection: 'row', gap: 2 },
  actionBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
});
