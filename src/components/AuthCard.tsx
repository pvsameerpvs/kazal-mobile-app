import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Colors, Radius, Spacing } from '@/theme';
import { GlassCard, Txt } from '@/components';

type Props = {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  onSignOut: () => void;
};

export function AuthCard({ name, email, avatarUrl, onSignOut }: Props) {
  const initial = (name ?? email ?? '?').charAt(0).toUpperCase();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.userRow}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Txt variant="h3" style={{ color: Colors.cyan }}>
              {initial}
            </Txt>
          </View>
        )}
        <View style={styles.userInfo}>
          <Txt variant="bodyStrong" numberOfLines={1} style={styles.userName}>
            {name ?? 'Google User'}
          </Txt>
          <Txt variant="caption" style={styles.userEmail} numberOfLines={1}>
            {email}
          </Txt>
        </View>
        <View style={styles.verifiedDot}>
          <Ionicons name="shield-checkmark" size={13} color={Colors.cyan} />
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
        onPress={onSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sign out of Google account"
      >
        <Ionicons name="log-out-outline" size={16} color={Colors.textSecondary} />
        <Txt variant="label" style={{ color: Colors.textSecondary }}>
          Sign Out
        </Txt>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: Spacing.lg },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
  },
  avatarFallback: {
    backgroundColor: 'rgba(43,210,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1 },
  userName: { color: Colors.text },
  userEmail: { color: Colors.textMuted, marginTop: 2 },
  verifiedDot: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(43,210,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
