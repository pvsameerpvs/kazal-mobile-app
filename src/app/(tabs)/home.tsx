import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/theme';
import { Screen, GlassCard, IconTile, SectionHeader, OpportunityCard, Txt } from '@/components';
import { quickAccess, opportunities } from '@/data/mock';

export default function Home() {
  const router = useRouter();
  const latest = opportunities[0];

  return (
    <Screen contentStyle={styles.content}>
      {/* Minimal top row */}
      <View style={styles.topRow}>
        <Txt variant="label" style={{ color: Colors.textSecondary }}>
          Welcome
        </Txt>
        <Pressable style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="person" size={18} color={Colors.textSecondary} />
        </Pressable>
      </View>

      {/* Headline */}
      <Txt variant="h1" style={styles.headline}>
        Building Trust.{'\n'}Delivering Opportunities.
      </Txt>
      <Txt variant="body" style={styles.intro}>
        Connecting businesses with the right financial solutions across the GCC and beyond.
      </Txt>

      {/* About card */}
      <GlassCard style={styles.about}>
        <Txt variant="h3">About Us</Txt>
        <Txt variant="body" style={{ marginTop: 6 }}>
          Commercial finance advisory with strong business connections across UAE, Saudi Arabia, Qatar, and Oman.
        </Txt>
        <Pressable style={styles.learn} onPress={() => router.push('/(tabs)/profile')}>
          <Txt variant="label" style={{ color: Colors.cyan }}>
            Learn More
          </Txt>
          <Ionicons name="chevron-forward" size={14} color={Colors.cyan} />
        </Pressable>
      </GlassCard>

      {/* Quick Access */}
      <Txt variant="h3" style={styles.sectionLabel}>
        Quick Access
      </Txt>
      <View style={styles.quickRow}>
        {quickAccess.map((q) => (
          <GlassCard key={q.id} onPress={() => router.push(q.href)} style={styles.quickCard}>
            <View style={styles.quickInner}>
              <IconTile icon={q.icon} size={48} iconSize={22} />
              <Txt variant="caption" style={{ color: Colors.text }}>
                {q.label}
              </Txt>
            </View>
          </GlassCard>
        ))}
      </View>

      {/* Latest Opportunities */}
      <View style={styles.latest}>
        <SectionHeader
          title="Latest Opportunities"
          actionLabel="View All"
          onAction={() => router.push('/(tabs)/opportunities')}
        />
        <OpportunityCard
          opp={latest}
          onPress={() => router.push({ pathname: '/opportunity/[id]', params: { id: latest.id } })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: { fontSize: 30, lineHeight: 38 },
  intro: { marginTop: Spacing.md, maxWidth: '94%' },
  about: { marginTop: Spacing.xl },
  learn: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: Spacing.md },
  sectionLabel: { marginTop: Spacing.xxl, marginBottom: Spacing.md },
  quickRow: { flexDirection: 'row', gap: Spacing.md },
  quickCard: { flex: 1 },
  quickInner: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  latest: { marginTop: Spacing.xxl },
});
