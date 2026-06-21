export type OppStatus = 'Available' | 'In Discussion';
export type OppTag = 'LC' | 'Bonds' | 'BG' | 'Loans';

export type Opportunity = {
  id: string;
  tag: OppTag;
  title: string;
  amount: string;
  instrument: string;
  provider: string;
  issuingBank: string;
  country: string;
  metric?: { label: string; value: string };
  validity?: string;
  type?: string;
  tenor?: string;
  status: OppStatus;
  description: string;
};
