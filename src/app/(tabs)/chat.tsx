import { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '@/theme';
import { GlowBackground } from '@/components';
import { ChatHeader, ChatMessageList, ChatInput, ChatReplyBar, ChatAttachmentBar, ChatAttachMenu } from '@/components/chat';
import { useChat } from '@/hooks/useChat';
import type { ChatMessage, PendingAttachment } from '@/types';

const BOTTOM_GAP = 6;

export default function ChatScreen() {
  const { context, label } = useLocalSearchParams<{ context?: string; label?: string }>();
  const insets = useSafeAreaInsets();
  const [showAttach, setShowAttach] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const contextSent = useRef(false);

  const {
    messages, input, setInput, typing, replyTo, setReplyTo,
    pendingAttach, setPendingAttach, clearReply, clearAttach,
    send, sendContextMessage, addReaction,
  } = useChat();

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKbOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKbOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  useEffect(() => {
    if (context && label && !contextSent.current) {
      contextSent.current = true;
      setTimeout(() => sendContextMessage(`I'm interested in ${label}`), 400);
    }
  }, [context, label, sendContextMessage]);

  const onSwipeReply = useCallback((msg: ChatMessage) => setReplyTo(msg), [setReplyTo]);
  const onDoubleTap = useCallback((id: string) => addReaction(id, '❤️'), [addReaction]);

  const pickImage = useCallback(async (library: boolean) => {
    setShowAttach(false);
    const opts = { quality: 0.7 } as const;
    const result = library
      ? await ImagePicker.launchImageLibraryAsync(opts)
      : await ImagePicker.launchCameraAsync(opts);
    if (!result.canceled && result.assets[0]) {
      const { uri, fileName } = result.assets[0];
      setPendingAttach({ type: 'image', uri, name: fileName ?? 'Photo' } as PendingAttachment);
    }
  }, [setPendingAttach]);

  const pickDocument = useCallback(async () => {
    setShowAttach(false);
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (!result.canceled && result.assets[0]) {
      const { uri, name, size, mimeType } = result.assets[0];
      setPendingAttach({
        type: 'file', uri, name,
        size: size ? `${(size / 1024).toFixed(0)} KB` : undefined,
        mimeType: mimeType ?? undefined,
      } as PendingAttachment);
    }
  }, [setPendingAttach]);

  const bottomPad = kbOpen ? BOTTOM_GAP : Math.max(insets.bottom, 8);

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />
      <GlowBackground />

      <View style={[styles.flex, { paddingTop: insets.top }]}>
        <ChatHeader />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ChatMessageList
            messages={messages}
            typing={typing}
            onSwipeReply={onSwipeReply}
            onReact={addReaction}
            onDoubleTap={onDoubleTap}
          />
          {replyTo && <ChatReplyBar message={replyTo} onClose={clearReply} />}
          {pendingAttach && <ChatAttachmentBar attachment={pendingAttach} onClear={clearAttach} />}
          <View style={{ paddingBottom: bottomPad }}>
            <ChatInput
              value={input}
              onChangeText={setInput}
              onSend={send}
              onAttach={() => { Keyboard.dismiss(); setTimeout(() => setShowAttach(true), 100); }}
              hasAttachment={!!pendingAttach}
            />
          </View>
        </KeyboardAvoidingView>
      </View>

      <ChatAttachMenu
        visible={showAttach}
        onClose={() => setShowAttach(false)}
        onCamera={() => pickImage(false)}
        onGallery={() => pickImage(true)}
        onDocument={pickDocument}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },
});
