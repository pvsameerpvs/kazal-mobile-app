import { useRef, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Radius, Spacing, Type } from '@/theme';
import { Txt } from '@/components';
import { DOUBLE_TAP_MS } from '@/constants/chat';
import { ChatReactions } from './ChatReactions';
import type { ChatMessage } from '@/types';

type Props = {
  message: ChatMessage;
  grouped: boolean;
  isLastInGroup: boolean;
  onSwipeReply: () => void;
  onReact: (emoji: string) => void;
  onDoubleTap: () => void;
};

export function ChatBubble({
  message, grouped, isLastInGroup, onSwipeReply, onReact, onDoubleTap,
}: Props) {
  const mine = message.from === 'me';
  const translateX = useSharedValue(0);
  const [showReactions, setShowReactions] = useState(false);
  const lastTap = useRef(0);

  const hasImage = !!message.image;
  const hasFile = !!message.file;
  const hasText = !!message.text;
  const hasReactions = message.reactions && message.reactions.length > 0;

  const statusIcon = mine
    ? (message.status === 'read' ? 'checkmark-done' as const : 'checkmark' as const)
    : null;
  const statusColor = message.status === 'read' ? Colors.cyan : 'rgba(255,255,255,0.5)';

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      onDoubleTap();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const pan = Gesture.Pan()
    .activeOffsetX(10)
    .onUpdate((e) => { translateX.value = Math.min(e.translationX, 80); })
    .onEnd(() => {
      if (translateX.value > 50) runOnJS(onSwipeReply)();
      translateX.value = withSpring(0);
    });

  const longPress = Gesture.LongPress()
    .minDuration(400)
    .onStart(() => runOnJS(setShowReactions)(true));

  const composed = Gesture.Race(pan, longPress);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  return (
    <View>
      {showReactions && (
        <ChatReactions
          isMine={mine}
          onReact={(emoji) => { onReact(emoji); setShowReactions(false); }}
          onClose={() => setShowReactions(false)}
        />
      )}
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            styles.row,
            mine ? styles.rowMine : styles.rowTheirs,
            animStyle,
            grouped && !isLastInGroup && { marginBottom: 2 },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleTap}
            style={[
              styles.bubble,
              mine ? styles.bubbleMine : styles.bubbleTheirs,
              grouped && mine && !isLastInGroup && styles.bubbleMineGrouped,
              grouped && !mine && !isLastInGroup && styles.bubbleTheirsGrouped,
              grouped && mine && isLastInGroup && styles.bubbleMineEnd,
              grouped && !mine && isLastInGroup && styles.bubbleTheirsEnd,
              hasImage && styles.bubbleImageWrap,
            ]}
          >
            {mine && !hasImage && (
              <LinearGradient colors={Gradients.cta} style={StyleSheet.absoluteFill} />
            )}
            {mine && hasImage && (
              <LinearGradient
                colors={['rgba(43,210,255,0.08)', 'rgba(28,125,240,0.08)']}
                style={StyleSheet.absoluteFill}
              />
            )}

            {message.replyTo && (
              <View style={[styles.quoteBar, mine ? styles.quoteMine : styles.quoteTheirs]}>
                <Txt variant="caption" style={mine ? styles.quoteOwnerMine : styles.quoteOwnerTheirs}>
                  {message.replyTo.from}
                </Txt>
                <Txt variant="caption" style={mine ? styles.quoteTextMine : styles.quoteTextTheirs} numberOfLines={1}>
                  {message.replyTo.text}
                </Txt>
              </View>
            )}

            {hasImage && (
              <Image source={{ uri: message.image }} style={styles.image} resizeMode="cover" />
            )}

            {hasFile && message.file && (
              <View style={styles.fileRow}>
                <View style={[styles.fileIcon, { backgroundColor: mine ? 'rgba(255,255,255,0.15)' : 'rgba(43,210,255,0.12)' }]}>
                  <Ionicons name="document-text" size={20} color={mine ? Colors.white : Colors.cyan} />
                </View>
                <View style={styles.fileInfo}>
                  <Txt variant="bodyStrong" numberOfLines={1} style={mine ? { color: Colors.white } : undefined}>
                    {message.file.name}
                  </Txt>
                  <Txt variant="caption" style={{ color: mine ? 'rgba(255,255,255,0.7)' : Colors.textMuted }}>
                    {message.file.mimeType ?? 'Document'} · {message.file.size}
                  </Txt>
                </View>
              </View>
            )}

            {hasText && (
              <Txt
                style={[
                  Type.body,
                  { lineHeight: 20 },
                  mine ? styles.textMine : styles.textTheirs,
                  !hasImage && !hasFile
                    ? { paddingVertical: 2 }
                    : { paddingTop: hasImage ? Spacing.sm : 0, paddingBottom: 2 },
                ]}
              >
                {message.text}
              </Txt>
            )}

            {hasReactions && message.reactions && (
              <View style={[styles.reactedRow, mine ? styles.reactedMine : styles.reactedTheirs]}>
                {message.reactions.map((r) => (
                  <Txt key={r} style={{ fontSize: 14 }}>{r}</Txt>
                ))}
              </View>
            )}

            <View style={[styles.footer, mine && styles.footerMine]}>
              <Txt variant="caption" style={mine ? styles.timeMine : styles.timeTheirs}>
                {message.time}
              </Txt>
              {statusIcon && (
                <Ionicons name={statusIcon} size={14} color={statusColor} style={{ marginLeft: 2 }} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 4 },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },

  bubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    overflow: 'hidden',
  },
  bubbleMine: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    borderTopLeftRadius: 4,
    borderTopRightRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  bubbleMineGrouped: {
    borderTopRightRadius: Radius.lg,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  bubbleTheirsGrouped: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  bubbleMineEnd: {
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: Radius.lg,
    borderTopLeftRadius: Radius.lg,
    marginBottom: Spacing.xs,
  },
  bubbleTheirsEnd: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: Radius.lg,
    borderTopLeftRadius: 4,
    borderTopRightRadius: Radius.lg,
    marginBottom: Spacing.xs,
  },
  bubbleImageWrap: { padding: 0, overflow: 'hidden' },
  textMine: { color: Colors.white },
  textTheirs: { color: Colors.text },

  quoteBar: { paddingLeft: Spacing.sm, paddingBottom: 4, marginBottom: 4, borderLeftWidth: 3 },
  quoteMine: { borderLeftColor: 'rgba(255,255,255,0.5)' },
  quoteTheirs: { borderLeftColor: Colors.cyan },
  quoteOwnerMine: { color: 'rgba(255,255,255,0.9)', fontWeight: '700', fontSize: 11 },
  quoteOwnerTheirs: { color: Colors.cyan, fontWeight: '700', fontSize: 11 },
  quoteTextMine: { color: 'rgba(255,255,255,0.6)' },
  quoteTextTheirs: { color: Colors.textSecondary },

  fileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  fileIcon: { width: 40, height: 40, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  fileInfo: { flex: 1 },

  image: { width: 200, height: 200, borderRadius: Radius.md },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2, marginTop: 2, height: 16 },
  footerMine: { justifyContent: 'flex-end' },
  timeMine: { color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: 0.2 },
  timeTheirs: { color: Colors.textMuted, fontSize: 11, letterSpacing: 0.2 },

  reactedRow: {
    flexDirection: 'row', gap: 1, marginTop: 4, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.15)', alignSelf: 'flex-start',
  },
  reactedMine: { alignSelf: 'flex-end' },
  reactedTheirs: { alignSelf: 'flex-start' },
});
