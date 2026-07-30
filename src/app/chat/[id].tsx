import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Keyboard, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '@/theme';
import { ChatHeader, ChatMessageList, ChatInput, ChatReplyBar, ChatAttachmentBar, ChatAttachMenu } from '@/components/chat';
import { useChat } from '@/hooks/useChat';
import { chatThreads } from '@/data';
import type { ChatMessage, PendingAttachment } from '@/types';

export default function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = chatThreads.find((t) => t.id === id) ?? chatThreads[0];
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const {
    messages, input, setInput, typing, replyTo, setReplyTo,
    pendingAttach, setPendingAttach, loadMore, clearReply, clearAttach,
    send, addReaction,
  } = useChat({ threadId: thread.id });

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const handleSwipeReply = useCallback((msg: ChatMessage) => {
    setReplyTo(msg);
  }, [setReplyTo]);

  const handleDoubleTap = useCallback((msgId: string) => {
    addReaction(msgId, '❤️');
  }, [addReaction]);

  const handleAttachRemove = () => setPendingAttach(null);

  const handleCamera = useCallback(async () => {
    setShowAttachMenu(false);
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      const { uri, fileName } = result.assets[0];
      setPendingAttach({ type: 'image', uri, name: fileName ?? 'Photo' } as PendingAttachment);
    }
  }, [setPendingAttach]);

  const handleGallery = useCallback(async () => {
    setShowAttachMenu(false);
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      const { uri, fileName } = result.assets[0];
      setPendingAttach({ type: 'image', uri, name: fileName ?? 'Image' } as PendingAttachment);
    }
  }, [setPendingAttach]);

  const handleDocument = useCallback(async () => {
    setShowAttachMenu(false);
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

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ChatHeader thread={thread} />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
        >
          <ChatMessageList
            messages={messages}
            typing={typing}
            onLoadMore={loadMore}
            onSwipeReply={handleSwipeReply}
            onReact={addReaction}
            onDoubleTap={handleDoubleTap}
          />

          {replyTo && (
            <ChatReplyBar message={replyTo} onClose={clearReply} />
          )}

          {pendingAttach && (
            <ChatAttachmentBar attachment={pendingAttach} onClear={handleAttachRemove} />
          )}

          <ChatInput
            value={input}
            onChangeText={setInput}
            onSend={send}
            onAttach={() => { Keyboard.dismiss(); setShowAttachMenu(true); }}
            hasAttachment={!!pendingAttach}
            keyboardVisible={keyboardVisible}
            bottomPadding={insets.bottom}
          />
        </KeyboardAvoidingView>

        <ChatAttachMenu
          visible={showAttachMenu}
          onClose={() => setShowAttachMenu(false)}
          onCamera={handleCamera}
          onGallery={handleGallery}
          onDocument={handleDocument}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1 },
  flex: { flex: 1 },
});
