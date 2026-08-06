import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuth } from '@/hooks';
import { Colors } from '@/theme';

export default function AuthCallback() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'loading') return;
    router.replace(status === 'signedIn' ? '/(tabs)/home' : '/login');
  }, [status, router]);

  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={Colors.cyan} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg },
});
