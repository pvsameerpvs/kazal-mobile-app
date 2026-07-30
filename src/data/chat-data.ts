import type { ChatMessage } from '@/types';

const chatData: Record<string, ChatMessage[]> = {
  'th-lc': [
    { id: 'mlc1', from: 'me', text: 'Hi, I am interested in your Letter of Credit services. Can you share more details?', time: '10:30 AM' },
    { id: 'mlc2', from: 'advisor', text: 'Of course. We offer sight and usance LC solutions with a trusted GCC banking network. What is your trade corridor?', time: '10:32 AM' },
  ],
  'th-bg': [
    { id: 'mbg1', from: 'me', text: 'I need a bank guarantee for an infrastructure contract.', time: '9:15 AM' },
    { id: 'mbg2', from: 'advisor', text: 'We can help with bid, performance, and advance payment bonds. What is the contract value?', time: '9:18 AM' },
  ],
  'th-sblc': [
    { id: 'msb1', from: 'me', text: 'Looking for a standby LC for a long-term agreement.', time: '3:00 PM' },
    { id: 'msb2', from: 'advisor', text: 'Standby LCs are ideal for large contracts. Let us know the tenor and amount you need.', time: '3:05 PM' },
  ],
  'th-bonds': [
    { id: 'mbd1', from: 'me', text: 'I am interested in the sovereign bond allocation.', time: '11:20 AM' },
    { id: 'mbd2', from: 'advisor', text: 'The sovereign bond allocation can be reserved for you. Please share your investment preferences.', time: '11:25 AM' },
    { id: 'mbd3', from: 'advisor', file: { name: 'Bond_Allocation.pdf', size: '890 KB' }, time: '11:26 AM' },
  ],
  'th-loans': [
    { id: 'mln1', from: 'me', text: 'We are looking for working capital funding of USD 5M.', time: '2:10 PM' },
    { id: 'mln2', from: 'advisor', text: 'We can structure a commercial loan to match your cash flow. What is your repayment timeline?', time: '2:12 PM' },
    { id: 'mln3', from: 'advisor', file: { name: 'Loan_Options.pdf', size: '1.1 MB' }, time: '2:14 PM' },
  ],
  'th-trade': [
    { id: 'mtr1', from: 'me', text: 'We need trade finance for our import operations.', time: 'Mon' },
    { id: 'mtr2', from: 'advisor', text: 'We offer import and export financing with multi-currency support. Let me review your requirements.', time: 'Mon' },
  ],
  'th-credit': [
    { id: 'mcr1', from: 'me', text: 'We need a revolving credit facility.', time: 'Tue' },
    { id: 'mcr2', from: 'advisor', text: 'We can arrange a flexible credit line. What is your expected monthly volume?', time: 'Tue' },
  ],
  'th-support': [
    { id: 'msu1', from: 'advisor', text: 'Welcome to Prime Capital Advisory. How can we help you today?', time: 'Mon' },
  ],
};

export function getThreadMessages(threadId: string): ChatMessage[] {
  return chatData[threadId] ?? chatData['th-support'] ?? [];
}
