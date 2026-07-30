import { useCallback, useRef } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Spacing } from '@/theme';
import { ChatBubble } from './ChatBubble';
import { ChatDateSeparator } from './ChatDateSeparator';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { shouldShowDateSeparator, shouldGroupWithPrevious } from '@/utils/chat';
import type { ChatMessage } from '@/types';

type Props = {
  messages: ChatMessage[];
  typing: boolean;
  onLoadMore: () => void;
  onSwipeReply: (msg: ChatMessage) => void;
  onReact: (msgId: string, emoji: string) => void;
  onDoubleTap: (msgId: string) => void;
};

export function ChatMessageList({
  messages, typing, onLoadMore, onSwipeReply, onReact, onDoubleTap,
}: Props) {
  const listRef = useRef<FlatList>(null);

  const renderItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const showDate = shouldShowDateSeparator(messages, index);
      const grouped = shouldGroupWithPrevious(messages, index);
      const next = messages[index + 1];
      const isLastInGroup = !next || next.from !== item.from;

      return (
        <>
          {showDate && <ChatDateSeparator date={new Date(item.time)} />}
          <ChatBubble
            message={item}
            grouped={grouped}
            isLastInGroup={isLastInGroup}
            onSwipeReply={() => onSwipeReply(item)}
            onReact={(emoji) => onReact(item.id, emoji)}
            onDoubleTap={() => onDoubleTap(item.id)}
          />
        </>
      );
    },
    [messages, onSwipeReply, onReact, onDoubleTap],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <FlatList
      ref={listRef}
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={7}
      removeClippedSubviews
      ListFooterComponent={typing ? <ChatTypingIndicator /> : null}
      onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
