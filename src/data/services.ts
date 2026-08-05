import type { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'letter-of-credit',
    title: 'Letter of Credit',
    summary: 'Secure trade transactions with reliable LC solutions.',
    icon: { set: 'ion', name: 'document-text-outline' },
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80',
    description: 'Reliable Letter of Credit solutions that secure international trade and protect your capital until agreed terms are met.',
    features: ['Bank-guaranteed payment security', 'Sight & usance terms', 'Trusted GCC banking network'],
    subCategories: [
      {
        title: 'Sight LC',
        caption: 'Immediate payment once compliant documents are presented to the confirming bank.',
        icon: { set: 'ion', name: 'time-outline' },
      },
      {
        title: 'Usance LC',
        caption: 'Deferred payment terms that give buyers breathing room until maturity.',
        icon: { set: 'ion', name: 'calendar-outline' },
      },
      {
        title: 'Confirmed LC',
        caption: 'A second bank adds its guarantee, removing counterparty risk.',
        icon: { set: 'ion', name: 'shield-checkmark-outline' },
      },
      {
        title: 'Transferable LC',
        caption: 'For intermediaries who need to pass payment rights to suppliers.',
        icon: { set: 'ion', name: 'swap-horizontal-outline' },
      },
    ],
  },
  {
    id: 'bank-guarantee',
    title: 'Bank Guarantee',
    summary: 'Support contractual commitments with trusted guarantee solutions.',
    icon: { set: 'ion', name: 'shield-checkmark-outline' },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    description: 'Bid, performance and advance payment guarantees that demonstrate your financial credibility to partners and authorities.',
    features: ['Bid, performance & advance bonds', 'Recognised by leading banks', 'Fast issuance turnaround'],
    subCategories: [
      {
        title: 'Bid Bond',
        caption: 'Secures your tender submission and demonstrates serious commitment.',
        icon: { set: 'ion', name: 'document-attach-outline' },
      },
      {
        title: 'Performance Bond',
        caption: 'Covers contractual obligations if delivery falls short of agreed terms.',
        icon: { set: 'ion', name: 'ribbon-outline' },
      },
      {
        title: 'Advance Payment Guarantee',
        caption: 'Protects prepayments made to suppliers against non-performance.',
        icon: { set: 'ion', name: 'cash-outline' },
      },
      {
        title: 'Retention Guarantee',
        caption: 'Unlocks retained contract amounts by backstopping defect liability.',
        icon: { set: 'ion', name: 'lock-open-outline' },
      },
    ],
  },
  {
    id: 'standby-lc',
    title: 'Standby LC',
    summary: 'Flexible standby credit solutions for business needs.',
    icon: { set: 'mci', name: 'file-certificate-outline' },
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
    description: 'A standby Letter of Credit acts as a dependable backup payment promise for large contracts and long-term agreements.',
    features: ['Backup payment assurance', 'Suited to large contracts', 'Internationally accepted'],
    subCategories: [
      {
        title: 'Direct Standby',
        caption: 'A direct payment promise to the beneficiary when triggered.',
        icon: { set: 'ion', name: 'paper-plane-outline' },
      },
      {
        title: 'Counter Standby',
        caption: 'Backs another bank\u2019s standby for cross-border transactions.',
        icon: { set: 'ion', name: 'git-compare-outline' },
      },
      {
        title: 'Performance Standby',
        caption: 'Assures project delivery and quality obligations on time.',
        icon: { set: 'ion', name: 'checkmark-done-outline' },
      },
    ],
  },
  {
    id: 'government-bonds',
    title: 'Government Bonds',
    summary: 'Access selected bond opportunities for qualified clients.',
    icon: { set: 'mci', name: 'bank-outline' },
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    description: 'Selected sovereign and government-linked bond opportunities with advisory support on structuring, tenor and yield.',
    features: ['Sovereign-grade security', 'Predictable returns', 'Advisory on tenor & yield'],
    subCategories: [
      {
        title: 'Sovereign Bonds',
        caption: 'Securities issued by national governments for safe returns.',
        icon: { set: 'ion', name: 'globe-outline' },
      },
      {
        title: 'Treasury Bills',
        caption: 'Short-term sovereign paper with predictable, stable yields.',
        icon: { set: 'ion', name: 'archive-outline' },
      },
      {
        title: 'Municipal Bonds',
        caption: 'Issued by local authorities to fund public infrastructure.',
        icon: { set: 'ion', name: 'business-outline' },
      },
      {
        title: 'Corporate Bonds',
        caption: 'Debt issued by strong corporates with attractive coupons.',
        icon: { set: 'ion', name: 'analytics-outline' },
      },
    ],
  },
  {
    id: 'commercial-loans',
    title: 'Commercial Loans',
    summary: 'Funding support for expansion, operations, and working capital.',
    icon: { set: 'mci', name: 'cash-multiple' },
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
    description: 'Tailored commercial loan solutions matched to your cash flow and growth strategy — from working capital to expansion.',
    features: ['Working capital & term loans', 'Competitive rates', 'Structured to your cash flow'],
    subCategories: [
      {
        title: 'Working Capital Loan',
        caption: 'Short-term funding to keep daily operations and inventory moving.',
        icon: { set: 'ion', name: 'cart-outline' },
      },
      {
        title: 'Term Loan',
        caption: 'A fixed lump sum repaid over a defined tenor with clear terms.',
        icon: { set: 'ion', name: 'calendar-clear-outline' },
      },
      {
        title: 'Equipment Finance',
        caption: 'Finance for machinery and assets, preserving your cash flow.',
        icon: { set: 'ion', name: 'settings-outline' },
      },
      {
        title: 'Bridging Loan',
        caption: 'Temporary liquidity to close gaps before long-term funding.',
        icon: { set: 'ion', name: 'arrow-forward-circle-outline' },
      },
    ],
  },
  {
    id: 'trade-finance',
    title: 'Trade Finance',
    summary: 'Finance solutions tailored for import, export, and structured trade.',
    icon: { set: 'ion', name: 'boat-outline' },
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
    description: 'End-to-end trade finance that keeps your supply chain moving — from documentary collections to supplier financing.',
    features: ['Import & export financing', 'Supply chain solutions', 'Multi-currency support'],
    subCategories: [
      {
        title: 'Import Finance',
        caption: 'Funding to settle supplier invoices and clear goods at port.',
        icon: { set: 'ion', name: 'arrow-down-circle-outline' },
      },
      {
        title: 'Export Finance',
        caption: 'Pre- and post-shipment funding that accelerates your receivables.',
        icon: { set: 'ion', name: 'arrow-up-circle-outline' },
      },
      {
        title: 'Documentary Collections',
        caption: 'Bank-mediated document exchange against payment or acceptance.',
        icon: { set: 'ion', name: 'folder-open-outline' },
      },
      {
        title: 'Supplier Financing',
        caption: 'Early settlement for suppliers at discounted, negotiated rates.',
        icon: { set: 'ion', name: 'people-outline' },
      },
    ],
  },
  {
    id: 'credit-solutions',
    title: 'Credit Solutions',
    summary: 'Custom advisory for business credit and funding requirements.',
    icon: { set: 'ion', name: 'card-outline' },
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
    description: 'Flexible revolving credit and overdraft facilities designed to give your business liquidity exactly when needed.',
    features: ['Revolving credit lines', 'Overdraft facilities', 'Flexible repayment'],
    subCategories: [
      {
        title: 'Revolving Credit',
        caption: 'A flexible credit line you can draw, repay and reuse at will.',
        icon: { set: 'ion', name: 'repeat-outline' },
      },
      {
        title: 'Overdraft Facility',
        caption: 'Automatic buffer against temporary account shortfalls.',
        icon: { set: 'ion', name: 'wallet-outline' },
      },
      {
        title: 'Invoice Discounting',
        caption: 'Unlock cash tied up in unpaid invoices without waiting.',
        icon: { set: 'ion', name: 'receipt-outline' },
      },
      {
        title: 'SME Credit',
        caption: 'Tailored facilities sized for small and medium businesses.',
        icon: { set: 'ion', name: 'rocket-outline' },
      },
    ],
  },
  {
    id: 'other-solutions',
    title: 'Other Solutions',
    summary: 'Specialized advisory based on client needs.',
    icon: { set: 'ion', name: 'ellipsis-horizontal-circle-outline' },
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    description: 'Bespoke financial advisory shaped around your specific objectives, sector and market requirements.',
    features: ['Bespoke structuring', 'Sector-specific advisory', 'Regional & global reach'],
    subCategories: [
      {
        title: 'Structured Finance',
        caption: 'Complex, purpose-built funding structures for large deals.',
        icon: { set: 'ion', name: 'podium-outline' },
      },
      {
        title: 'Advisory Services',
        caption: 'Expert guidance on structuring, markets and strategy.',
        icon: { set: 'ion', name: 'compass-outline' },
      },
      {
        title: 'Risk Management',
        caption: 'Hedge currency, rate and commodity exposure effectively.',
        icon: { set: 'ion', name: 'umbrella-outline' },
      },
      {
        title: 'Wealth Planning',
        caption: 'Long-term planning to preserve and grow your capital.',
        icon: { set: 'ion', name: 'diamond-outline' },
      },
    ],
  },
];
