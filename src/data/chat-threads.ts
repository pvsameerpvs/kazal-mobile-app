import type { ChatThread, ChatContext } from '@/types';

export const chatThreads: ChatThread[] = [
  {
    id: 'th-lc',
    name: 'Letter of Credit',
    desk: 'Trade Finance Desk',
    preview: 'Thank you for your interest. How can we assist with your LC?',
    time: 'Just now',
    unread: 1,
    online: true,
    context: { type: 'service', id: 'letter-of-credit', label: 'Letter of Credit' },
  },
  {
    id: 'th-bg',
    name: 'Bank Guarantee',
    desk: 'Guarantees Desk',
    preview: 'We can issue bid and performance bonds swiftly.',
    time: '10:45 AM',
    unread: 0,
    online: true,
    context: { type: 'service', id: 'bank-guarantee', label: 'Bank Guarantee' },
  },
  {
    id: 'th-sblc',
    name: 'Standby LC',
    desk: 'Structured Finance',
    preview: 'Your standby LC inquiry has been received.',
    time: 'Yesterday',
    unread: 0,
    online: true,
    context: { type: 'service', id: 'standby-lc', label: 'Standby LC' },
  },
  {
    id: 'th-bonds',
    name: 'Government Bonds',
    desk: 'Capital Markets',
    preview: 'The sovereign bond allocation can be reserved for you.',
    time: 'Yesterday',
    unread: 0,
    online: true,
    context: { type: 'service', id: 'government-bonds', label: 'Government Bonds' },
  },
  {
    id: 'th-loans',
    name: 'Commercial Loans',
    desk: 'Lending Desk',
    preview: 'We have competitive rates for your requirements.',
    time: '2:15 PM',
    unread: 2,
    online: true,
    context: { type: 'service', id: 'commercial-loans', label: 'Commercial Loans' },
  },
  {
    id: 'th-trade',
    name: 'Trade Finance',
    desk: 'Trade Finance Desk',
    preview: 'Your trade finance options have been reviewed.',
    time: 'Mon',
    unread: 0,
    online: false,
    context: { type: 'service', id: 'trade-finance', label: 'Trade Finance' },
  },
  {
    id: 'th-credit',
    name: 'Credit Solutions',
    desk: 'Credit Advisory',
    preview: 'Your credit line options are ready for review.',
    time: 'Tue',
    unread: 0,
    online: false,
    context: { type: 'service', id: 'credit-solutions', label: 'Credit Solutions' },
  },
  {
    id: 'th-support',
    name: 'Client Support',
    desk: 'Relationship Team',
    preview: 'Welcome to Prime Capital Advisory. How can we help?',
    time: 'Mon',
    unread: 0,
    online: false,
  },
];

export function findThreadByContext(context: ChatContext): ChatThread | undefined {
  return chatThreads.find(
    (t) => t.context?.type === context.type && t.context?.id === context.id,
  );
}
