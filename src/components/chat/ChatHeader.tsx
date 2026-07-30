import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/theme';
import { Txt } from '@/components';
import type { ChatThread } from '@/types';

type Props = {
  thread: ChatThread;
};

export function ChatHeader({ thread }: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable style={styles.back} hitSlop={10} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color={Colors.text} />
      </Pressable>

      <View style={[styles.avatar, thread.online && styles.avatarActive]}>
        <Ionicons name="headset-outline" size={18} color={Colors.cyan} />
        {thread.online && <View style={styles.onlineDot} />}
      </View>

      <Pressable style={styles.info}>
        <Txt variant="title" numberOfLines={1}>{thread.name}</Txt>
        <Txt variant="caption" style={{ color: thread.online ? Colors.available : Colors.textMuted, fontSize: 12 }}>
          {thread.online ? 'Online' : 'Typically replies in a few minutes'}
        </Txt>
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} hitSlop={8}>
          <Ionicons name="call-outline" size={20} color={Colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.actionBtn} hitSlop={8}>
          <Ionicons name="ellipsis-vertical" size={18} color={Colors.textSecondary} />
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
    width: 38, height: 38, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(43,210,255,0.10)',
    borderWidth: 1, borderColor: Colors.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarActive: { borderColor: Colors.available },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.available,
    borderWidth: 2, borderColor: Colors.bg,
  },
  info: { flex: 1, marginLeft: Spacing.xs },
  actions: { flexDirection: 'row', gap: 4 },
  actionBtn: {
    width: 38, height: 38, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
});
