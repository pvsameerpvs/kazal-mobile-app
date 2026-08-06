import type { Session, User } from '@supabase/supabase-js';

export type AuthStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

export type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};
