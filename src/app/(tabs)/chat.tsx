import { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Radius, Spacing, Type } from '@/theme';
import { Txt } from '@/components';
import { chatThreads } from '@/data/mock';
import type { ChatThread } from '@/types';

const AVATAR_COLORS: [string, string][] = [
  ['#2BD2FF', '#1C7DF0'],
  ['#00C875', '#059669'],
  ['#FF5A5F', '#DC2626'],
  ['#AA82FF', '#7C3AED'],
  ['#FF9F43', '#EA580C'],
  ['#FF6B9D', '#E11D48'],
  ['#34D399', '#059669'],
  ['#60A5FA', '#2563EB'],
];

function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatTimestamp(raw: string) {
  if (raw === 'Just now') return raw;
  if (raw.includes(':')) return raw;
  if (raw === 'Yesterday' || raw === 'Mon' || raw === 'Tue' || raw === 'Wed' || raw === 'Thu' || raw === 'Fri' || raw === 'Sat' || raw === 'Sun') {
    return raw.slice(0, 3);
  }
  return raw;
}

type ThreadRowProps = {
  thread: ChatThread;
  index: number;
  onPress: () => void;
};

function ThreadRow({ thread, index, onPress }: ThreadRowProps) {
  const colors = getAvatarColor(index);
  const hasUnread = thread.unread > 0;

  return (
    <Pressable onPress={onPress} style={styles.threadRow}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <LinearGradient colors={colors} style={styles.avatarGradient}>
          <Txt style={styles.avatarInitials}>{getInitials(thread.name)}</Txt>
        </LinearGradient>
        {thread.online && <View style={styles.onlineDot} />}
      </View>

      {/* Content */}
      <View style={styles.threadContent}>
        <View style={styles.threadTop}>
          <Txt variant="bodyStrong" style={styles.threadName} numberOfLines={1}>
            {thread.name}
          </Txt>
          <Txt variant="caption" style={[styles.threadTime, hasUnread && styles.threadTimeUnread]}>
            {formatTimestamp(thread.time)}
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

export default function ChatList() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => search.trim()
      ? chatThreads.filter(t =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.desk.toLowerCase().includes(search.toLowerCase())
        )
      : chatThreads,
    [search]
  );

  const renderItem = ({ item, index }: { item: ChatThread; index: number }) => (
    <ThreadRow
      thread={item}
      index={index}
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}
    />
  );

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Txt variant="h2" style={{ color: Colors.text, fontWeight: '700' }}>Chats</Txt>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerBtn}>
              <Ionicons name="camera-outline" size={22} color={Colors.textSecondary} />
            </Pressable>
            <Pressable style={styles.headerBtn}>
              <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search chats"
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
            selectionColor={Colors.cyan}
          />
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        <Pressable style={[styles.filterChip, styles.filterChipActive]}>
          <Txt variant="label" style={{ color: Colors.cyan, fontWeight: '600' }}>All</Txt>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Txt variant="label" style={{ color: Colors.textSecondary }}>Unread</Txt>
        </Pressable>
        <Pressable style={styles.filterChip}>
          <Txt variant="label" style={{ color: Colors.textSecondary }}>Services</Txt>
        </Pressable>
      </View>

      {/* Thread list */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Txt variant="body" style={{ color: Colors.textMuted, marginTop: Spacing.md }}>No chats found</Txt>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  // Header
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerActions: { flexDirection: 'row', gap: 4 },
  headerBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    height: 42,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    ...Type.body,
    fontSize: 15,
    height: 42,
  },

  // Filters
  filterRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg, paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glass,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: 'rgba(43,210,255,0.10)',
    borderColor: Colors.borderAccent,
  },

  // List
  listContent: {
    paddingVertical: Spacing.xs,
  },

  // Thread row - WhatsApp style
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

  // Empty
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingTop: 100,
  },
});
