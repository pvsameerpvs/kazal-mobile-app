import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Spacing, Type } from '@/theme';
import { GlowBackground, Logo, Txt } from '@/components';
import { findThreadByContext } from '@/data/mock';

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams<{ context?: string; id?: string; label?: string }>();
  const [loading, setLoading] = useState(false);

  const contextLabel = useMemo(() => {
    if (params.context === 'service' && params.label) return params.label;
    if (params.context === 'opportunity' && params.label) return params.label;
    return null;
  }, [params]);

  const navigate = useMemo(() => {
    if (params.context && params.id) {
      const thread = findThreadByContext({ type: params.context as 'service' | 'opportunity', id: params.id, label: params.label ?? '' });
      if (thread) return () => router.replace({ pathname: '/chat/[id]', params: { id: thread.id } });
    }
    return () => router.replace('/(tabs)/chat');
  }, [params.context, params.id, params.label]);

  const signInWithGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      navigate();
    }, 1200);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />
      <GlowBackground />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.grabber} />
        <Pressable style={styles.close} hitSlop={10} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={Colors.textSecondary} />
        </Pressable>

        <View style={styles.body}>
          {/* Lock mark */}
          <View style={styles.lockRing}>
            <View style={styles.lockInner}>
              <Logo size={40} />
            </View>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={13} color={Colors.bg} />
            </View>
          </View>

          {contextLabel ? (
            <>
              <Txt variant="caption" style={styles.contextTag}>
                Inquiring about
              </Txt>
              <Txt variant="h1" style={styles.title}>
                {contextLabel}
              </Txt>
            </>
          ) : (
            <Txt variant="h1" style={styles.title}>
              Secure Access
            </Txt>
          )}
          <Txt variant="body" style={styles.subtitle}>
            Sign in to connect securely with our advisory team.
          </Txt>

          {/* Google Sign In */}
          <Pressable
            style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
            disabled={loading}
            onPress={signInWithGoogle}
          >
            <View style={styles.googleInner}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={Colors.white} />
                  <Txt style={[Type.bodyStrong, { color: Colors.white, fontSize: 15 }]}>Continue with Google</Txt>
                </>
              )}
            </View>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Txt variant="caption" style={{ color: Colors.textMuted, marginHorizontal: Spacing.md }}>
              secured
            </Txt>
            <View style={styles.dividerLine} />
          </View>

          {/* Trust note */}
          <View style={styles.reassure}>
            <Ionicons name="shield-checkmark" size={15} color={Colors.cyan} />
            <Txt variant="caption" style={{ color: Colors.textSecondary, flex: 1 }}>
              We only use your Google account to verify your identity. No data is shared without your consent.
            </Txt>
          </View>
        </View>

        <Txt variant="caption" style={styles.terms}>
          By continuing you agree to our Terms & Privacy Policy
        </Txt>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1, paddingHorizontal: Spacing.xl },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.glassHairline, alignSelf: 'center', marginTop: Spacing.sm },
  close: { position: 'absolute', top: Spacing.sm, right: Spacing.xl, width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassStrong, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lockRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    backgroundColor: 'rgba(43,210,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  lockInner: { alignItems: 'center', justifyContent: 'center' },
  lockBadge: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bg,
  },
  contextTag: { color: Colors.cyan, letterSpacing: 0.5, marginBottom: 4 },
  title: { marginTop: Spacing.xxl, textAlign: 'center' },
  subtitle: { textAlign: 'center', marginTop: Spacing.md, maxWidth: 320 },
  googleBtn: {
    alignSelf: 'stretch',
    marginTop: Spacing.xxl,
    height: 54,
    borderRadius: Radius.md,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    overflow: 'hidden',
  },
  googleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 54,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    alignSelf: 'stretch',
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.border },
  reassure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  terms: { textAlign: 'center', color: Colors.textMuted, marginBottom: Spacing.md },
});
