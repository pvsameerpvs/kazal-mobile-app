import { useCallback, useMemo, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
import { CHAT_PAGE_SIZE } from '@/constants/chat';
import { getThreadMessages } from '@/data/mock';
import type { ChatMessage, PendingAttachment } from '@/types';

type UseChatOptions = {
  threadId: string;
};

export function useChat({ threadId }: UseChatOptions) {
  const allMessages = useMemo(() => getThreadMessages(threadId), [threadId]);
  const [visibleMsgs, setVisibleMsgs] = useState<ChatMessage[]>(() =>
    allMessages.slice(-CHAT_PAGE_SIZE),
  );
  const [page, setPage] = useState(1);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [pendingAttach, setPendingAttach] = useState<PendingAttachment | null>(null);

  const totalPages = Math.ceil(allMessages.length / CHAT_PAGE_SIZE);

  const loadMore = useCallback(() => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    const start = Math.max(0, allMessages.length - nextPage * CHAT_PAGE_SIZE);
    setVisibleMsgs(allMessages.slice(start));
    setPage(nextPage);
  }, [page, totalPages, allMessages]);

  const clearReply = useCallback(() => setReplyTo(null), []);
  const clearAttach = useCallback(() => setPendingAttach(null), []);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text && !pendingAttach) return;

    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const time = `${h}:${m}`;

    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      from: 'me',
      time,
      status: 'sent',
      ...(text ? { text } : {}),
      ...(pendingAttach?.type === 'image' ? { image: pendingAttach.uri } : {}),
      ...(pendingAttach?.type === 'file'
        ? { file: { name: pendingAttach.name, size: pendingAttach.size ?? '0KB', mimeType: pendingAttach.mimeType } }
        : {}),
      ...(replyTo
        ? { replyTo: { text: replyTo.text ?? 'Message', from: replyTo.from === 'me' ? 'You' : 'Advisor' } }
        : {}),
    };

    setVisibleMsgs((prev) => [...prev, msg]);
    setInput('');
    clearReply();
    clearAttach();

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setVisibleMsgs((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'delivered' as const } : m)),
        );
      }, 500);

      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const reply: ChatMessage = {
          id: `r${Date.now()}`,
          from: 'advisor',
          time: formatTime(new Date()),
          text: pendingAttach
            ? `Thank you for sharing ${pendingAttach.type === 'image' ? 'the photo' : `"${pendingAttach.name}"`}. Our team will review and get back to you shortly.`
            : 'Thank you for your message. Our advisory team will review and get back to you shortly.',
        };
        setVisibleMsgs((prev) => [...prev, reply]);
        setTimeout(() => {
          setVisibleMsgs((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' as const } : m)),
          );
        }, 300);
      }, 1500);
    });
  }, [input, pendingAttach, replyTo, clearReply, clearAttach]);

  const addReaction = useCallback((msgId: string, reaction: string) => {
    setVisibleMsgs((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const existing = m.reactions ?? [];
        const idx = existing.indexOf(reaction);
        return {
          ...m,
          reactions: idx >= 0 ? existing.filter((r) => r !== reaction) : [...existing, reaction],
        };
      }),
    );
  }, []);

  return {
    messages: visibleMsgs,
    input,
    setInput,
    typing,
    replyTo,
    setReplyTo,
    pendingAttach,
    setPendingAttach,
    loadMore,
    clearReply,
    clearAttach,
    send,
    addReaction,
  };
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
