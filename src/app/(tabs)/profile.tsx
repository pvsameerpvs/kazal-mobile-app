import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/theme';
import { Screen, AnimatedIn, GlassCard, Button, Logo, Txt } from '@/components';
import { profile } from '@/data/mock';

function QuickAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickIcon, { borderColor: color + '55', backgroundColor: color + '14' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Txt variant="caption" style={{ color: Colors.textSecondary }}>
        {label}
      </Txt>
    </Pressable>
  );
}

export default function Profile() {
  const router = useRouter();

  return (
    <Screen contentStyle={styles.content}>
      {/* Header */}
      <AnimatedIn index={0}>
        <GlassCard padded={false} style={styles.header}>
          <View style={styles.headerInner}>
            <View style={styles.logoRing}>
              <Logo size={52} />
            </View>
            <Txt variant="h2" style={{ marginTop: Spacing.lg, textAlign: 'center' }}>
              About {profile.name}
            </Txt>
            <View style={styles.verified}>
              <Ionicons name="shield-checkmark" size={13} color={Colors.cyan} />
              <Txt variant="caption" style={{ color: Colors.cyan }}>
                {profile.role}
              </Txt>
            </View>
          </View>
        </GlassCard>
      </AnimatedIn>

      {/* Quick actions */}
      <AnimatedIn index={1}>
        <View style={styles.actions}>
          <QuickAction icon="call-outline" label="Call" color={Colors.teal} onPress={() => router.push('/contact')} />
          <QuickAction icon="logo-whatsapp" label="WhatsApp" color="#25D366" onPress={() => router.push('/contact')} />
          <QuickAction icon="mail-outline" label="Email" color={Colors.cyan} onPress={() => router.push('/contact')} />
          <QuickAction icon="chatbubbles-outline" label="Chat" color={Colors.blue} onPress={() => router.push('/(tabs)/chat')} />
        </View>
      </AnimatedIn>

      {/* Intro */}
      <AnimatedIn index={2}>
        <Txt variant="body" style={styles.intro}>
          {profile.intro}
        </Txt>
      </AnimatedIn>

      {/* Key points */}
      <AnimatedIn index={3}>
        <Txt variant="h3" style={styles.sectionLabel}>
          What We Do
        </Txt>
        <GlassCard padded={false}>
          {profile.keyPoints.map((t, i) => (
            <View key={t} style={[styles.point, i < profile.keyPoints.length - 1 && styles.pointBorder]}>
              <View style={styles.check}>
                <Ionicons name="checkmark" size={14} color={Colors.cyan} />
              </View>
              <Txt variant="bodyStrong" style={{ flex: 1 }}>
                {t}
              </Txt>
            </View>
          ))}
        </GlassCard>
      </AnimatedIn>

      {/* Markets */}
      <AnimatedIn index={4}>
        <Txt variant="h3" style={styles.sectionLabel}>
          Markets
        </Txt>
        <View style={styles.tags}>
          {profile.markets.map((c) => (
            <View key={c} style={styles.tag}>
              <Ionicons name="location" size={13} color={Colors.cyan} />
              <Txt variant="label" style={{ color: Colors.text }}>
                {c}
              </Txt>
            </View>
          ))}
        </View>
      </AnimatedIn>

      <AnimatedIn index={5}>
        <Button
          label="Contact Us"
          icon="chatbubble-ellipses-outline"
          onPress={() => router.push('/contact')}
          style={styles.contactBtn}
        />
      </AnimatedIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  header: { overflow: 'hidden' },
  headerInner: { alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg },
  logoRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    backgroundColor: 'rgba(43,210,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(43,210,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.lg },
  quickAction: { alignItems: 'center', gap: Spacing.sm, flex: 1 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  intro: { marginTop: Spacing.xl, fontSize: 15, lineHeight: 23 },
  sectionLabel: { marginTop: Spacing.xxl, marginBottom: Spacing.md },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
  },
  point: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
  pointBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(43,210,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBtn: { marginTop: Spacing.xxl },
});
