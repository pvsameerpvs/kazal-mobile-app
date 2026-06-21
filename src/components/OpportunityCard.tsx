import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/theme';
import type { Opportunity } from '@/types';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { Txt } from './Txt';

/** Clean, scannable opportunity row — title, provider, metric + validity, status. */
export function OpportunityCard({ opp, onPress }: { opp: Opportunity; onPress?: () => void }) {
  return (
    <GlassCard onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <Txt variant="title" style={styles.title} numberOfLines={1}>
          {opp.title}
        </Txt>
        <StatusBadge status={opp.status} />
      </View>
      <Txt variant="body" style={styles.provider}>
        {opp.provider}
      </Txt>
      <View style={styles.metaRow}>
        {opp.metric && (
          <Txt variant="label" style={{ color: Colors.cyan }}>
            {opp.metric.label} {opp.metric.value}
          </Txt>
        )}
        {opp.validity && (
          <Txt variant="caption" style={{ color: Colors.textSecondary }}>
            Valid till {opp.validity}
          </Txt>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  title: { flex: 1 },
  provider: { marginTop: 4, color: Colors.textSecondary },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
});
