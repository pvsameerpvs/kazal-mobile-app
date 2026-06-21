import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/theme';
import { Screen, TopBar, GlassCard, Button, StatusBadge, Txt } from '@/components';
import { opportunities } from '@/data/mock';

export default function OpportunityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const opp = opportunities.find((o) => o.id === id) ?? opportunities[0];

  const rows: { label: string; value: string }[] = [
    { label: 'Issuing Bank', value: opp.issuingBank },
    { label: 'Country', value: opp.country },
    ...(opp.metric ? [{ label: opp.metric.label, value: opp.metric.value }] : []),
    ...(opp.validity ? [{ label: 'Validity', value: opp.validity }] : []),
    ...(opp.type ? [{ label: 'Type', value: opp.type }] : []),
    ...(opp.tenor ? [{ label: 'Tenor', value: opp.tenor }] : []),
  ];

  return (
    <Screen contentStyle={styles.content}>
      <TopBar
        action={
          <Pressable hitSlop={8} style={styles.bookmark}>
            <Ionicons name="bookmark-outline" size={20} color={Colors.textSecondary} />
          </Pressable>
        }
      />

      <StatusBadge status={opp.status} large />
      <Txt variant="h2" style={styles.instrument}>
        {opp.instrument}
      </Txt>
      <Txt variant="display" style={styles.amount}>
        {opp.amount}
      </Txt>

      {/* Detail rows */}
      <GlassCard padded={false} style={styles.rowsCard}>
        {rows.map((r, i) => (
          <View key={r.label} style={[styles.row, i < rows.length - 1 && styles.rowBorder]}>
            <Txt variant="body">{r.label}</Txt>
            <Txt variant="bodyStrong" style={styles.rowValue}>
              {r.value}
            </Txt>
          </View>
        ))}
      </GlassCard>

      {/* Description */}
      <Txt variant="h3" style={styles.sectionLabel}>
        Description
      </Txt>
      <Txt variant="body" style={{ fontSize: 15, lineHeight: 23 }}>
        {opp.description}
      </Txt>

      {/* CTAs */}
      <View style={styles.ctas}>
        <Button
          label="Inquire Now"
          icon="document-text-outline"
          onPress={() => router.push({ pathname: '/login', params: { context: 'opportunity', id: opp.id, label: opp.title } })}
        />
        <Button
          label="Chat About This"
          variant="secondary"
          icon="chatbubble-ellipses-outline"
          onPress={() => router.push({ pathname: '/login', params: { context: 'opportunity', id: opp.id, label: opp.title } })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxxl },
  bookmark: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instrument: { marginTop: Spacing.lg, color: Colors.textSecondary, fontWeight: '600' },
  amount: { marginTop: 2, color: Colors.text },
  rowsCard: { marginTop: Spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  rowValue: { flexShrink: 1, textAlign: 'right', marginLeft: Spacing.lg },
  sectionLabel: { marginTop: Spacing.xxl, marginBottom: Spacing.md },
  ctas: { marginTop: Spacing.xxl, gap: Spacing.md },
});
