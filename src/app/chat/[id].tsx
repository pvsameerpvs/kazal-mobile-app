import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Keyboard, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients } from '@/theme';
import { ChatHeader, ChatMessageList, ChatInput, ChatReplyBar, ChatAttachmentBar, ChatAttachMenu } from '@/components/chat';
import { useChat } from '@/hooks/useChat';
import { chatThreads } from '@/data/mock';
import type { ChatMessage } from '@/types';

export default function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = chatThreads.find((t) => t.id === id) ?? chatThreads[0];
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
  const handleCamera = () => {};
  const handleGallery = () => {};
  const handleDocument = () => {};

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
            onAttach={() => Keyboard.dismiss()}
            hasAttachment={!!pendingAttach}
            keyboardVisible={keyboardVisible}
            bottomPadding={insets.bottom}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1 },
  flex: { flex: 1 },
});
