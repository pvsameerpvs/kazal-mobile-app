import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '@/theme';
import { Txt } from '@/components';
import { CHAT_AVATAR_COLORS } from '@/constants/chat';
import { getChatInitials, formatChatTimestamp } from '@/utils/chat';
import type { ChatThread } from '@/types';

type Props = {
  thread: ChatThread;
  index: number;
  onPress: () => void;
};

function getAvatarColor(index: number) {
  return CHAT_AVATAR_COLORS[index % CHAT_AVATAR_COLORS.length];
}

export function ThreadRow({ thread, index, onPress }: Props) {
  const colors = getAvatarColor(index);
  const hasUnread = thread.unread > 0;

  return (
    <Pressable onPress={onPress} style={styles.threadRow}>
      <View style={styles.avatarWrapper}>
        <LinearGradient colors={colors} style={styles.avatarGradient}>
          <Txt style={styles.avatarInitials}>{getChatInitials(thread.name)}</Txt>
        </LinearGradient>
        {thread.online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.threadContent}>
        <View style={styles.threadTop}>
          <Txt variant="bodyStrong" style={styles.threadName} numberOfLines={1}>
            {thread.name}
          </Txt>
          <Txt variant="caption" style={[styles.threadTime, hasUnread && styles.threadTimeUnread]}>
            {formatChatTimestamp(thread.time)}
          </Txt>
        </View>

        <View style={styles.threadBottom}>
          <Txt
            variant="caption"
            style={[styles.threadPreview, hasUnread && styles.threadPreviewUnread]}
            numberOfLines={1}
          >
            {thread.preview}
          </Txt>

          {hasUnread && (
            <View style={styles.unreadBadge}>
              <Txt style={styles.unreadText}>{thread.unread}</Txt>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  threadRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatarWrapper: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarGradient: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: {
    color: Colors.white,
    fontSize: 18, fontWeight: '700',
    letterSpacing: 1,
  },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 13, height: 13, borderRadius: 6.5,
    backgroundColor: Colors.available,
    borderWidth: 2.5, borderColor: Colors.bg,
  },
  threadContent: { flex: 1, gap: 4 },
  threadTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  threadName: { flex: 1, color: Colors.text },
  threadTime: { color: Colors.textMuted, fontSize: 12, marginLeft: Spacing.sm },
  threadTimeUnread: { color: Colors.cyan, fontWeight: '600' },
  threadBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  threadPreview: { flex: 1, color: Colors.textSecondary, fontSize: 13 },
  threadPreviewUnread: { color: Colors.text, fontWeight: '500' },
  unreadBadge: {
    minWidth: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.cyan,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6, marginLeft: Spacing.sm,
  },
  unreadText: {
    color: Colors.bg, fontSize: 11, fontWeight: '800',
  },
});
