import type { IconRef, Company, Profile, QuickAccessItem } from '@/types';

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

export const quickAccess: QuickAccessItem[] = [
  {
    id: 'services',
    label: 'Services',
    icon: { set: 'ion', name: 'briefcase-outline' } as IconRef,
    href: '/(tabs)/services',
  },
  {
    id: 'opportunities',
    label: 'Opportunities',
    icon: { set: 'ion', name: 'trending-up-outline' } as IconRef,
    href: '/(tabs)/opportunities',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: { set: 'ion', name: 'chatbubbles-outline' } as IconRef,
    href: '/(tabs)/chat',
  },
];

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
