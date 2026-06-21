import type { IconRef, Service, Opportunity, OppTag, ChatThread, ChatMessage, ChatContext, Company, Profile } from '@/types';

export const company: Company = {
  name: 'Prime Capital Advisory',
  slogan: 'Connecting Capital with Opportunity',
  tagline: 'Your Trusted Partner in Commercial Finance',
  trust: 'Trusted by businesses. Driven by integrity.',
  phone: '+971 4 123 4567',
  whatsapp: '+971 4 123 4567',
  email: 'info@primecapital.ae',
  instagram: '@primecapital',
  linkedin: 'Prime Capital Advisory',
  address: {
    city: 'Dubai, UAE',
    line: 'Office details can be added here',
  },
};

export const quickAccess = [
  {
    id: 'services' as const,
    label: 'Services',
    icon: { set: 'ion', name: 'briefcase-outline' } as IconRef,
    href: '/(tabs)/services' as const,
  },
  {
    id: 'opportunities' as const,
    label: 'Opportunities',
    icon: { set: 'ion', name: 'trending-up-outline' } as IconRef,
    href: '/(tabs)/opportunities' as const,
  },
  {
    id: 'chat' as const,
    label: 'Chat',
    icon: { set: 'ion', name: 'chatbubbles-outline' } as IconRef,
    href: '/(tabs)/chat' as const,
  },
];

export const services: Service[] = [
  {
    id: 'letter-of-credit',
    title: 'Letter of Credit',
    summary: 'Secure trade transactions with reliable LC solutions.',
    icon: { set: 'ion', name: 'document-text-outline' },
    description: 'Reliable Letter of Credit solutions that secure international trade and protect your capital until agreed terms are met.',
    features: ['Bank-guaranteed payment security', 'Sight & usance terms', 'Trusted GCC banking network'],
  },
  {
    id: 'bank-guarantee',
    title: 'Bank Guarantee',
    summary: 'Support contractual commitments with trusted guarantee solutions.',
    icon: { set: 'ion', name: 'shield-checkmark-outline' },
    description: 'Bid, performance and advance payment guarantees that demonstrate your financial credibility to partners and authorities.',
    features: ['Bid, performance & advance bonds', 'Recognised by leading banks', 'Fast issuance turnaround'],
  },
  {
    id: 'standby-lc',
    title: 'Standby LC',
    summary: 'Flexible standby credit solutions for business needs.',
    icon: { set: 'mci', name: 'file-certificate-outline' },
    description: 'A standby Letter of Credit acts as a dependable backup payment promise for large contracts and long-term agreements.',
    features: ['Backup payment assurance', 'Suited to large contracts', 'Internationally accepted'],
  },
  {
    id: 'government-bonds',
    title: 'Government Bonds',
    summary: 'Access selected bond opportunities for qualified clients.',
    icon: { set: 'mci', name: 'bank-outline' },
    description: 'Selected sovereign and government-linked bond opportunities with advisory support on structuring, tenor and yield.',
    features: ['Sovereign-grade security', 'Predictable returns', 'Advisory on tenor & yield'],
  },
  {
    id: 'commercial-loans',
    title: 'Commercial Loans',
    summary: 'Funding support for expansion, operations, and working capital.',
    icon: { set: 'mci', name: 'cash-multiple' },
    description: 'Tailored commercial loan solutions matched to your cash flow and growth strategy — from working capital to expansion.',
    features: ['Working capital & term loans', 'Competitive rates', 'Structured to your cash flow'],
  },
  {
    id: 'trade-finance',
    title: 'Trade Finance',
    summary: 'Finance solutions tailored for import, export, and structured trade.',
    icon: { set: 'ion', name: 'boat-outline' },
    description: 'End-to-end trade finance that keeps your supply chain moving — from documentary collections to supplier financing.',
    features: ['Import & export financing', 'Supply chain solutions', 'Multi-currency support'],
  },
  {
    id: 'credit-solutions',
    title: 'Credit Solutions',
    summary: 'Custom advisory for business credit and funding requirements.',
    icon: { set: 'ion', name: 'card-outline' },
    description: 'Flexible revolving credit and overdraft facilities designed to give your business liquidity exactly when needed.',
    features: ['Revolving credit lines', 'Overdraft facilities', 'Flexible repayment'],
  },
  {
    id: 'other-solutions',
    title: 'Other Solutions',
    summary: 'Specialized advisory based on client needs.',
    icon: { set: 'ion', name: 'ellipsis-horizontal-circle-outline' },
    description: 'Bespoke financial advisory shaped around your specific objectives, sector and market requirements.',
    features: ['Bespoke structuring', 'Sector-specific advisory', 'Regional & global reach'],
  },
];

export const oppTabs: ('All' | OppTag)[] = ['All', 'LC', 'Bonds', 'BG', 'Loans'];

export const opportunities: Opportunity[] = [
  {
    id: 'op-standby',
    tag: 'LC',
    title: 'Standby LC – EUR 2M',
    amount: 'EUR 2,000,000',
    instrument: 'Standby LC',
    provider: 'HSBC Bank – UAE',
    issuingBank: 'HSBC Bank',
    country: 'UAE',
    validity: '25 May 2026',
    type: 'Standby LC',
    tenor: '360 Days',
    status: 'Available',
    description: 'Flexible standby credit facility, structured quickly with a tier-1 international bank.',
  },
  {
    id: 'op-lc',
    tag: 'LC',
    title: 'Letter of Credit – USD 5M',
    amount: 'USD 5,000,000',
    instrument: 'Letter of Credit',
    provider: 'Standard Chartered – UAE',
    issuingBank: 'Standard Chartered Bank',
    country: 'UAE',
    metric: { label: 'Discount', value: '35%' },
    validity: '30 May 2026',
    type: 'Sight LC',
    tenor: '180 Days',
    status: 'Available',
    description: 'MT760 available. Documents against payment. Fast and secure process.',
  },
  {
    id: 'op-bond',
    tag: 'Bonds',
    title: 'Government Bond – USD 10M',
    amount: 'USD 10,000,000',
    instrument: 'Government Bond',
    provider: 'US Treasury Bond',
    issuingBank: 'US Treasury',
    country: 'United States',
    metric: { label: 'Discount', value: '30%' },
    validity: '15 Jun 2026',
    type: 'Sovereign Bond',
    tenor: '5 Years',
    status: 'Available',
    description: 'Government-backed bond allocation offering stable, sovereign-grade returns.',
  },
  {
    id: 'op-bg',
    tag: 'BG',
    title: 'Bank Guarantee – USD 3M',
    amount: 'USD 3,000,000',
    instrument: 'Bank Guarantee',
    provider: 'Emirates NBD – UAE',
    issuingBank: 'Emirates NBD',
    country: 'UAE',
    metric: { label: 'Discount', value: '25%' },
    validity: '10 May 2026',
    type: 'Performance Bond',
    tenor: '24 Months',
    status: 'In Discussion',
    description: 'Performance guarantee supporting a major regional infrastructure contract.',
  },
  {
    id: 'op-loan',
    tag: 'Loans',
    title: 'Commercial Loan – USD 20M',
    amount: 'USD 20,000,000',
    instrument: 'Commercial Loan',
    provider: 'Multiple Banks – UAE',
    issuingBank: 'Syndicated Facility',
    country: 'UAE',
    metric: { label: 'Interest Rate', value: '6.5% onwards' },
    type: 'Term Loan',
    tenor: '36 Months',
    status: 'Available',
    description: 'Syndicated funding for expansion, operations and working capital.',
  },
];

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

const threadMessages: Record<string, ChatMessage[]> = {
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
  return threadMessages[threadId] ?? threadMessages['th-support'] ?? [];
}

export function findThreadByContext(context: ChatContext): ChatThread | undefined {
  return chatThreads.find(
    (t) => t.context?.type === context.type && t.context?.id === context.id,
  );
}

export const profile: Profile = {
  name: 'Prime Capital Advisory',
  role: 'Commercial Finance Advisory',
  intro:
    'Prime Capital Advisory helps businesses connect with suitable commercial finance solutions across regional and international markets.',
  keyPoints: [
    'Commercial Finance Advisory',
    'Banking Instruments',
    'Trade Finance Support',
    'Regional Business Network',
  ],
  markets: ['UAE', 'Saudi Arabia', 'Qatar', 'Oman'],
};
