import { useCallback, useState } from 'react';
import { InteractionManager } from 'react-native';
import type { ChatMessage, PendingAttachment } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [pendingAttach, setPendingAttach] = useState<PendingAttachment | null>(null);

  const clearReply = useCallback(() => setReplyTo(null), []);
  const clearAttach = useCallback(() => setPendingAttach(null), []);

  const sendContextMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const msg: ChatMessage = {
      id: `ctx${Date.now()}`,
      from: 'me',
      time: `${h}:${m}`,
      status: 'sent',
      text,
    };
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => {
      setMessages((prev) =>
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
        text: `Thank you for your interest in ${text.split('in ').pop() ?? 'our services'}. Our team will get back to you shortly.`,
      };
      setMessages((prev) => [...prev, reply]);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' as const } : m)),
        );
      }, 300);
    }, 1200);
  }, []);

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

    setMessages((prev) => [...prev, msg]);
    setInput('');
    clearReply();
    clearAttach();

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setMessages((prev) =>
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
        setMessages((prev) => [...prev, reply]);
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' as const } : m)),
          );
        }, 300);
      }, 1500);
    });
  }, [input, pendingAttach, replyTo, clearReply, clearAttach]);

  const addReaction = useCallback((msgId: string, reaction: string) => {
    setMessages((prev) =>
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
    messages,
    input,
    setInput,
    typing,
    replyTo,
    setReplyTo,
    pendingAttach,
    setPendingAttach,
    clearReply,
    clearAttach,
    send,
    sendContextMessage,
    addReaction,
  };
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
