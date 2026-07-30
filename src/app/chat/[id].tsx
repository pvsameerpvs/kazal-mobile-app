import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Image,
  Alert,
  useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Spacing, Type } from '@/theme';
import { Txt } from '@/components';
import { chatThreads, getThreadMessages } from '@/data/mock';
import type { ChatMessage, PendingAttachment } from '@/types';

const REACTIONS = ['👍', '❤️', '😊', '📌'];

export default function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const thread = chatThreads.find((t) => t.id === id) ?? chatThreads[0];
  const [msgs, setMsgs] = useState(getThreadMessages(thread.id));
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [typing, setTyping] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [pendingAttach, setPendingAttach] = useState<PendingAttachment | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const webBound = Platform.OS === 'web' ? { maxHeight: height } : null;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const clearReply = () => setReplyTo(null);

  const clearAttach = () => setPendingAttach(null);

  const openAttachMenu = useCallback(() => {
    Keyboard.dismiss();
    setShowAttachMenu(true);
  }, []);

  const pickImage = useCallback(async (useCamera: boolean) => {
    setShowAttachMenu(false);
    try {
      if (useCamera) {
        const camPerm = await ImagePicker.getCameraPermissionsAsync();
        if (!camPerm.granted) {
          const result = await ImagePicker.requestCameraPermissionsAsync();
          if (!result.granted) {
            Alert.alert('Camera permission required', 'Please enable camera access in Settings to take photos.');
            return;
          }
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });
        if (!result.canceled && result.assets[0]) {
          setPendingAttach({ type: 'image', uri: result.assets[0].uri, name: result.assets[0].fileName ?? 'photo.jpg' });
        }
      } else {
        const libPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!libPerm.granted) {
          const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!result.granted) {
            Alert.alert('Photo library access required', 'Please enable photo library access in Settings to choose photos.');
            return;
          }
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });
        if (!result.canceled && result.assets[0]) {
          setPendingAttach({ type: 'image', uri: result.assets[0].uri, name: result.assets[0].fileName ?? 'photo.jpg' });
        }
      }
    } catch {
      Alert.alert('Something went wrong', 'Could not open the camera or gallery. Please try again.');
    }
  }, []);

  const pickDocument = useCallback(async () => {
    setShowAttachMenu(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: Platform.OS === 'ios' ? 'public.data' : '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setPendingAttach({
          type: 'file',
          uri: asset.uri,
          name: asset.name,
          size: asset.size ? `${(asset.size / 1024).toFixed(0)} KB` : undefined,
          mimeType: asset.mimeType ?? undefined,
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      if (message.includes('cancel') || message.includes('CANCELED')) return;
      Alert.alert('Something went wrong', 'Could not open the file picker. Please try again.');
    }
  }, []);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text && !pendingAttach) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      from: 'me',
      ...(text ? { text } : {}),
      ...(pendingAttach?.type === 'image' ? { image: pendingAttach.uri } : {}),
      ...(pendingAttach?.type === 'file' ? { file: { name: pendingAttach.name, size: pendingAttach.size ?? '0KB', mimeType: pendingAttach.mimeType } } : {}),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyTo ? { text: replyTo.text ?? (replyTo.image ? '📷 Photo' : '(file)'), from: replyTo.from === 'me' ? 'You' : 'Advisor' } : undefined,
    };
    setMsgs((prev) => [...prev, msg]);
    setInput('');
    clearReply();
    clearAttach();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate typing indicator
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply: ChatMessage = {
        id: `r${Date.now()}`,
        from: 'advisor',
        text: pendingAttach
          ? `Thank you for sharing ${pendingAttach.type === 'image' ? 'the photo' : `"${pendingAttach.name}"`}. Our advisory team will review and get back to you shortly.`
          : 'Thank you for your message. Our advisory team will review and get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMsgs((prev) => [...prev, reply]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1800);
  }, [input, replyTo, pendingAttach]);

  const handleSwipeReply = useCallback((msg: ChatMessage) => {
    setReplyTo(msg);
  }, []);

  const addReaction = useCallback((msgId: string, reaction: string) => {
    setMsgs((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const existing = m.reactions ?? [];
          const idx = existing.indexOf(reaction);
          return {
            ...m,
            reactions: idx >= 0 ? existing.filter((r) => r !== reaction) : [...existing, reaction],
          };
        }
        return m;
      }),
    );
  }, []);

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
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
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
              <Bubble
                key={m.id}
                message={m}
                onSwipeReply={() => handleSwipeReply(m)}
                onReact={(emoji) => addReaction(m.id, emoji)}
              />
            ))}
            {typing && (
              <View style={styles.typingRow}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDot} />
                  <View style={[styles.typingDot, { animationDelay: '0.2s' }]} />
                  <View style={[styles.typingDot, { animationDelay: '0.4s' }]} />
                </View>
              </View>
            )}
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
                  {replyTo.text ?? (replyTo.image ? '📷 Photo' : replyTo.file ? `📄 ${replyTo.file.name}` : '')}
                </Txt>
              </View>
            </View>
          )}

          {/* Pending attachment preview */}
          {pendingAttach && (
            <View style={styles.pendingAttachBar}>
              {pendingAttach.type === 'image' ? (
                <Image source={{ uri: pendingAttach.uri }} style={styles.pendingImage} />
              ) : (
                <View style={styles.pendingFilePreview}>
                  <Ionicons name="document-text" size={24} color={Colors.cyan} />
                  <View style={styles.flex}>
                    <Txt variant="bodyStrong" numberOfLines={1} style={{ color: Colors.text }}>{pendingAttach.name}</Txt>
                    {pendingAttach.size && <Txt variant="caption" style={{ color: Colors.textMuted }}>{pendingAttach.size}</Txt>}
                  </View>
                </View>
              )}
              <Pressable hitSlop={8} onPress={clearAttach} style={styles.clearAttachBtn}>
                <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
              </Pressable>
            </View>
          )}

          {/* Input bar */}
          <View style={[styles.inputBar, { paddingBottom: keyboardVisible ? Spacing.sm : Math.max(insets.bottom, Spacing.sm) }]}>
            <View style={styles.inputRow}>
              <Pressable style={styles.attachBtn} onPress={openAttachMenu}>
                <Ionicons name="attach-outline" size={20} color={Colors.textMuted} />
              </Pressable>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                placeholderTextColor={Colors.textMuted}
                style={styles.inputField}
                selectionColor={Colors.cyan}
                multiline
              />
              <Pressable style={[styles.sendBtn, !input.trim() && !pendingAttach && styles.sendDisabled]} onPress={send} disabled={!input.trim() && !pendingAttach}>
                <Ionicons name="send" size={18} color={input.trim() || pendingAttach ? Colors.cyan : Colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {/* Attach menu modal */}
          <Modal visible={showAttachMenu} transparent animationType="fade" onRequestClose={() => setShowAttachMenu(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setShowAttachMenu(false)}>
              <View style={styles.attachMenu}>
                <Txt variant="title" style={styles.attachMenuTitle}>Add Attachment</Txt>
                <View style={styles.attachMenuOptions}>
                  <Pressable style={styles.attachMenuItem} onPress={() => pickImage(true)}>
                    <View style={[styles.attachMenuIcon, { backgroundColor: 'rgba(43,210,255,0.12)' }]}>
                      <Ionicons name="camera" size={22} color={Colors.cyan} />
                    </View>
                    <Txt>Camera</Txt>
                  </Pressable>
                  <Pressable style={styles.attachMenuItem} onPress={() => pickImage(false)}>
                    <View style={[styles.attachMenuIcon, { backgroundColor: 'rgba(255,159,67,0.12)' }]}>
                      <Ionicons name="images" size={22} color="#FF9F43" />
                    </View>
                    <Txt>Gallery</Txt>
                  </Pressable>
                  <Pressable style={styles.attachMenuItem} onPress={pickDocument}>
                    <View style={[styles.attachMenuIcon, { backgroundColor: 'rgba(255,107,107,0.12)' }]}>
                      <Ionicons name="document" size={22} color="#FF6B6B" />
                    </View>
                    <Txt>Document</Txt>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Bubble({ message, onSwipeReply, onReact }: { message: ChatMessage; onSwipeReply: () => void; onReact: (emoji: string) => void }) {
  const mine = message.from === 'me';
  const translateX = useSharedValue(0);
  const [showReactions, setShowReactions] = useState(false);

  const pan = Gesture.Pan()
    .activeOffsetX(10)
    .onUpdate((e) => {
      translateX.value = Math.min(e.translationX, 80);
    })
    .onEnd(() => {
      if (translateX.value > 50) {
        runOnJS(onSwipeReply)();
      }
      translateX.value = withSpring(0);
    });

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      runOnJS(setShowReactions)(true);
    });

  const composed = Gesture.Race(pan, longPress);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View>
      {showReactions && (
        <View style={[styles.reactionsRow, mine ? styles.reactionsRowMine : styles.reactionsRowTheirs]}>
          {REACTIONS.map((emoji) => (
            <Pressable key={emoji} onPress={() => { onReact(emoji); setShowReactions(false); }} style={styles.reactionBtn}>
              <Txt style={{ fontSize: 18 }}>{emoji}</Txt>
            </Pressable>
          ))}
          <Pressable onPress={() => setShowReactions(false)} style={styles.reactionBtn}>
            <Ionicons name="close" size={14} color={Colors.textMuted} />
          </Pressable>
        </View>
      )}
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs, animStyle]}>
          <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
            {mine && <LinearGradient colors={Gradients.cta} style={StyleSheet.absoluteFill} />}
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
            {message.image ? (
              <Image source={{ uri: message.image }} style={styles.bubbleImage} />
            ) : message.file ? (
              <View style={styles.fileRow}>
                <View style={styles.fileIcon}>
                  <Ionicons name="document-text" size={20} color={mine ? Colors.white : Colors.cyan} />
                </View>
                <View>
                  <Txt variant="bodyStrong" style={mine ? styles.textMine : undefined}>
                    {message.file.name}
                  </Txt>
                  <Txt variant="caption" style={{ color: mine ? 'rgba(255,255,255,0.8)' : Colors.textSecondary }}>
                    {message.file.mimeType ?? 'File'} · {message.file.size}
                  </Txt>
                </View>
              </View>
            ) : null}
            {message.text && (
              <Txt style={[Type.body, styles.bubbleText, mine && styles.textMine]}>{message.text}</Txt>
            )}
            {message.reactions && message.reactions.length > 0 && (
              <View style={[styles.reactedRow, mine ? styles.reactedMine : styles.reactedTheirs]}>
                {message.reactions.map((r) => (
                  <Txt key={r} style={{ fontSize: 13 }}>{r}</Txt>
                ))}
              </View>
            )}
            <View style={[styles.bubbleFooter, mine && styles.bubbleFooterMine]}>
              <Txt variant="caption" style={[styles.time, { color: mine ? 'rgba(255,255,255,0.75)' : Colors.textMuted }]}>
                {message.time}
              </Txt>
              {mine && (
                <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.6)" />
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
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
  bubbleImage: {
    width: 220,
    height: 220,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  pendingAttachBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgRaised,
    gap: Spacing.sm,
  },
  pendingImage: {
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
  },
  pendingFilePreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  clearAttachBtn: { padding: 4 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  attachMenu: {
    backgroundColor: Colors.bgRaised,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  attachMenuTitle: { marginBottom: Spacing.lg, textAlign: 'center' },
  attachMenuOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.md,
  },
  attachMenuItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  attachMenuIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
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
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginLeft: 2,
  },
  typingRow: { flexDirection: 'row', justifyContent: 'flex-start' },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: 4,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 4,
    marginHorizontal: 12,
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
  },
  reactionsRowMine: { alignSelf: 'flex-end' },
  reactionsRowTheirs: { alignSelf: 'flex-start' },
  reactionBtn: {
    padding: 4,
  },
  reactedRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'flex-start',
  },
  reactedMine: { alignSelf: 'flex-end' },
  reactedTheirs: { alignSelf: 'flex-start' },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleFooterMine: { justifyContent: 'flex-end' },
});
