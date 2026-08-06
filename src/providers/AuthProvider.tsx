import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from '@/api/supabase';
import {
  AUTH_CALLBACK_PATH,
  AUTH_ERROR_MESSAGES,
  GOOGLE_OAUTH_PARAMS,
} from '@/constants/auth';
import type { AuthContextValue, AuthStatus } from '@/types/auth';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = AuthSession.makeRedirectUri({ path: AUTH_CALLBACK_PATH });

export const AuthContext = createContext<AuthContextValue | null>(null);

type Props = { children: ReactNode };

function errorFromRedirectUrl(url: string): string | null {
  const params = new URL(url).searchParams;
  const error = params.get('error');
  if (!error) return null;
  return AUTH_ERROR_MESSAGES[error] ?? AUTH_ERROR_MESSAGES.access_denied;
}

export function AuthProvider({ children }: Props) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) {
      setStatus('signedOut');
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setStatus(data.session ? 'signedIn' : 'signedOut');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setStatus(newSession ? 'signedIn' : 'signedOut');
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error(AUTH_ERROR_MESSAGES.not_configured);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: GOOGLE_OAUTH_PARAMS,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) throw new Error(AUTH_ERROR_MESSAGES.no_session_url);

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo, {
      showInRecents: true,
    });

    if (result.type !== 'success') throw new Error(AUTH_ERROR_MESSAGES.access_denied);

    const redirectError = errorFromRedirectUrl(result.url);
    if (redirectError) throw new Error(redirectError);

    const code = new URL(result.url).searchParams.get('code');
    if (!code) throw new Error(AUTH_ERROR_MESSAGES.no_auth_code);

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw new Error(AUTH_ERROR_MESSAGES.exchange_failed);
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, session, user, signInWithGoogle, signOut }),
    [status, session, user, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
