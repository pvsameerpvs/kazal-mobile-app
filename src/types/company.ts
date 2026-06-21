export type Company = {
  name: string;
  slogan: string;
  tagline: string;
  trust: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  linkedin: string;
  address: {
    city: string;
    line: string;
  };
};

export type Profile = {
  name: string;
  role: string;
  intro: string;
  keyPoints: string[];
  markets: string[];
};

export type QuickAccessItem = {
  id: string;
  label: string;
  icon: import('./icon').IconRef;
  href: string;
};
