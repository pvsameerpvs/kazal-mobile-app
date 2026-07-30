import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Spacing, Type } from '@/theme';
import { Txt, ThreadRow } from '@/components';
import { chatThreads } from '@/data';
import type { ChatThread } from '@/types';

export default function ChatList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Services'>('All');

  const filtered = useMemo(() => {
    let threads = chatThreads;
    if (search.trim()) {
      threads = threads.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.desk.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter === 'Unread') {
      threads = threads.filter(t => t.unread > 0);
    } else if (filter === 'Services') {
      threads = threads.filter(t => t.context?.type === 'service');
    }
    return threads;
  }, [search, filter]);

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
      <SafeAreaView style={styles.safe} edges={['top']}>
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

        <View style={styles.filterRow}>
          {(['All', 'Unread', 'Services'] as const).map((f) => (
            <Pressable
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Txt variant="label" style={{ color: filter === f ? Colors.cyan : Colors.textSecondary, fontWeight: filter === f ? '600' : '400' }}>
                {f}
              </Txt>
            </Pressable>
          ))}
        </View>

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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
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
  listContent: { paddingVertical: Spacing.xs },
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingTop: 100,
  },
});
