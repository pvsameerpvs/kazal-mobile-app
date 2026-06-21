import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Spacing, Type } from '@/theme';
import { Button, Txt } from '@/components';
import { chatThreads, chatMessages } from '@/data/mock';
import type { ChatMessage } from '@/types';

export default function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const thread = chatThreads.find((t) => t.id === id) ?? chatThreads[0];
  const { height } = useWindowDimensions();
  const webBound = Platform.OS === 'web' ? { maxHeight: height } : null;

  return (
    <View style={[styles.root, webBound]}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.back} hitSlop={10} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </Pressable>
          <View style={styles.avatar}>
            <Ionicons name="headset-outline" size={18} color={Colors.cyan} />
            {thread.online && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.flex}>
            <Txt variant="title" numberOfLines={1}>
              {thread.name}
            </Txt>
            <Txt variant="caption" style={{ color: thread.online ? Colors.available : Colors.textMuted }}>
              {thread.online ? 'Online' : thread.desk}
            </Txt>
          </View>
          <Pressable style={styles.secureIcon} hitSlop={8}>
            <Ionicons name="ellipsis-vertical" size={18} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        >
          <Txt variant="caption" style={styles.dayLabel}>
            Today
          </Txt>
          {chatMessages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
        </ScrollView>

        {/* Login gate */}
        <View style={styles.gate}>
          <View style={styles.gateNote}>
            <Ionicons name="lock-closed" size={13} color={Colors.textSecondary} />
            <Txt variant="caption" style={{ color: Colors.textSecondary }}>
              Login to continue the conversation
            </Txt>
          </View>
          <Button label="Login / Sign Up" icon="log-in-outline" onPress={() => router.push('/login')} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const mine = message.from === 'me';
  return (
    <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        {mine && <LinearGradient colors={Gradients.cta} style={StyleSheet.absoluteFill} />}
        {message.file ? (
          <View style={styles.fileRow}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={20} color={mine ? Colors.white : Colors.cyan} />
            </View>
            <View>
              <Txt variant="bodyStrong" style={mine ? styles.textMine : undefined}>
                {message.file.name}
              </Txt>
              <Txt variant="caption" style={{ color: mine ? 'rgba(255,255,255,0.8)' : Colors.textSecondary }}>
                PDF · {message.file.size}
              </Txt>
            </View>
          </View>
        ) : (
          <Txt style={[Type.body, styles.bubbleText, mine && styles.textMine]}>{message.text}</Txt>
        )}
        <Txt variant="caption" style={[styles.time, { color: mine ? 'rgba(255,255,255,0.75)' : Colors.textMuted }]}>
          {message.time}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(43,210,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.available,
    borderWidth: 2,
    borderColor: Colors.bg,
  },
  secureIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: { padding: Spacing.xl, gap: Spacing.md },
  dayLabel: { textAlign: 'center', color: Colors.textMuted, marginBottom: Spacing.sm },
  bubbleRow: { flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '82%',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    overflow: 'hidden',
  },
  bubbleMine: { borderBottomRightRadius: 4 },
  bubbleTheirs: {
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { color: Colors.text },
  textMine: { color: Colors.white },
  time: { marginTop: 4, alignSelf: 'flex-end' },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(43,210,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gate: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  gateNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
