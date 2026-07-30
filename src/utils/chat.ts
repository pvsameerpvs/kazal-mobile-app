import { GROUP_MS } from '@/constants/chat';
import type { ChatMessage } from '@/types';

export function formatChatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function formatChatTimestamp(raw: string): string {
  if (raw === 'Just now') return raw;
  if (raw.includes(':')) return raw;
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (shortDays.includes(raw)) return raw.slice(0, 3);
  return raw;
}

export function formatDateSeparator(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return 'Today';
  if (msgDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });
}

export function shouldShowDateSeparator(msgs: ChatMessage[], index: number): boolean {
  if (index === 0) return true;
  const curr = new Date(msgs[index].time).getDate();
  const prev = new Date(msgs[index - 1].time).getDate();
  return curr !== prev;
}

export function shouldGroupWithPrevious(msgs: ChatMessage[], index: number): boolean {
  if (index === 0) return false;
  const curr = msgs[index];
  const prev = msgs[index - 1];
  if (curr.from !== prev.from) return false;
  const diff = new Date(curr.time).getTime() - new Date(prev.time).getTime();
  return diff < GROUP_MS;
}

export function getChatInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
