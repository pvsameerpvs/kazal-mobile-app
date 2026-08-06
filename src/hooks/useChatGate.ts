import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from './useAuth';

export function useChatGate() {
  const router = useRouter();
  const { status } = useAuth();

  return useCallback(
    (context?: string, label?: string) => {
      const params: Record<string, string> = {};
      if (context) params.context = context;
      if (label) params.label = label;

      if (status === 'signedIn') {
        router.push({ pathname: '/(tabs)/chat', params });
      } else {
        router.push({ pathname: '/login', params });
      }
    },
    [router, status],
  );
}