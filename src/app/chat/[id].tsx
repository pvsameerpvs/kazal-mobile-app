import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Spacing, Type } from '@/theme';
import { Txt } from '@/components';
import { chatThreads, getThreadMessages } from '@/data/mock';
import type { ChatMessage } from '@/types';

export default function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const thread = chatThreads.find((t) => t.id === id) ?? chatThreads[0];
  const [msgs, setMsgs] = useState(getThreadMessages(thread.id));
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const webBound = Platform.OS === 'web' ? { maxHeight: height } : null;

  const clearReply = () => setReplyTo(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      from: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyTo ? { text: replyTo.text ?? '(file)', from: replyTo.from === 'me' ? 'You' : 'Advisor' } : undefined,
    };
    setMsgs((prev) => [...prev, msg]);
    setInput('');
    clearReply();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `r${Date.now()}`,
        from: 'advisor',
        text: 'Thank you for your message. Our advisory team will review and get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMsgs((prev) => [...prev, reply]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);
  };

  return (
    <View style={[styles.root, webBound]}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
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

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={styles.messages}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            <Txt variant="caption" style={styles.dayLabel}>
              Today
            </Txt>
            {msgs.map((m) => (
              <Bubble key={m.id} message={m} onSwipe={() => setReplyTo(m)} />
            ))}
          </ScrollView>

          {/* Reply preview */}
          {replyTo && (
            <View style={styles.replyBar}>
              <View style={styles.replyLine} />
              <View style={styles.replyContent}>
                <View style={styles.replyHead}>
                  <Txt variant="caption" style={{ color: Colors.cyan, fontWeight: '700' }}>
                    {replyTo.from === 'me' ? 'You' : 'Advisor'}
                  </Txt>
                  <Pressable hitSlop={8} onPress={clearReply}>
                    <Ionicons name="close" size={16} color={Colors.textMuted} />
                  </Pressable>
                </View>
                <Txt variant="caption" style={{ color: Colors.textSecondary }} numberOfLines={1}>
                  {replyTo.text ?? (replyTo.file ? `📄 ${replyTo.file.name}` : '')}
                </Txt>
              </View>
            </View>
          )}

          {/* Input bar */}
          <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                placeholderTextColor={Colors.textMuted}
                style={styles.inputField}
                selectionColor={Colors.cyan}
                multiline
              />
              <Pressable style={[styles.sendBtn, !input.trim() && styles.sendDisabled]} onPress={send} disabled={!input.trim()}>
                <Ionicons name="send" size={18} color={input.trim() ? Colors.cyan : Colors.textMuted} />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Bubble({ message, onSwipe }: { message: ChatMessage; onSwipe: () => void }) {
  const mine = message.from === 'me';
  const translateX = useSharedValue(0);
  const swiped = useSharedValue(false);

  const pan = Gesture.Pan()
    .activeOffsetX(-10)
    .onUpdate((e) => {
      if (!swiped.value && e.translationX > 0) {
        translateX.value = Math.min(e.translationX, 80);
      }
    })
    .onEnd(() => {
      if (translateX.value > 50) {
        runOnJS(onSwipe)();
        translateX.value = withSpring(0);
        swiped.value = true;
        setTimeout(() => { swiped.value = false; }, 300);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs, animStyle]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          {mine && <LinearGradient colors={Gradients.cta} style={StyleSheet.absoluteFill} />}
          {/* Reply quote */}
          {message.replyTo && (
            <View style={[styles.quoteBar, mine ? styles.quoteMine : styles.quoteTheirs]}>
              <Txt variant="caption" style={{ color: mine ? 'rgba(255,255,255,0.8)' : Colors.cyan, fontWeight: '700', fontSize: 11 }}>
                {message.replyTo.from}
              </Txt>
              <Txt variant="caption" style={{ color: mine ? 'rgba(255,255,255,0.65)' : Colors.textSecondary }} numberOfLines={1}>
                {message.replyTo.text}
              </Txt>
            </View>
          )}
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
      </Animated.View>
    </GestureDetector>
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
  inputBar: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    paddingLeft: Spacing.md,
  },
  inputField: {
    flex: 1,
    color: Colors.text,
    ...Type.body,
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: Spacing.md,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    marginRight: 6,
  },
  sendDisabled: {},
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgRaised,
    gap: Spacing.sm,
  },
  replyLine: { width: 3, height: 40, borderRadius: 2, backgroundColor: Colors.cyan },
  replyContent: { flex: 1, gap: 2 },
  replyHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quoteBar: {
    paddingLeft: Spacing.sm,
    paddingBottom: Spacing.xs,
    marginBottom: Spacing.xs,
    borderLeftWidth: 2,
  },
  quoteMine: { borderLeftColor: 'rgba(255,255,255,0.5)' },
  quoteTheirs: { borderLeftColor: Colors.cyan },
});
