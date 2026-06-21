import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/theme';
import {
  Screen,
  TopBar,
  GlassCard,
  IconTile,
  Button,
  StatusBadge,
  SectionHeader,
  Txt,
} from '@/components';
import { services, opportunities } from '@/data/mock';

export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const service = services.find((s) => s.id === id) ?? services[0];

  const keyword = service.title.split(' ')[0].toLowerCase();
  const related = opportunities
    .filter((o) => o.instrument.toLowerCase().includes(keyword))
    .concat(opportunities.filter((o) => o.status === 'Available'))
    .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i)
    .slice(0, 2);

  return (
    <Screen contentStyle={styles.content}>
      <TopBar title="Service" />

      {/* Header */}
      <View style={styles.header}>
        <IconTile icon={service.icon} size={64} iconSize={30} />
        <View style={styles.headerText}>
          <Txt variant="h1">{service.title}</Txt>
        </View>
      </View>

      <Txt variant="body" style={styles.summary}>
        {service.description}
      </Txt>

      {/* Key features */}
      <Txt variant="h3" style={styles.sectionLabel}>
        Key Highlights
      </Txt>
      <GlassCard padded={false} style={styles.benefitsCard}>
        {service.features.map((f, i) => (
          <View key={f} style={[styles.benefit, i < service.features.length - 1 && styles.benefitBorder]}>
            <View style={styles.check}>
              <Ionicons name="checkmark" size={14} color={Colors.cyan} />
            </View>
            <Txt variant="bodyStrong" style={styles.benefitText}>
              {f}
            </Txt>
          </View>
        ))}
      </GlassCard>

      {/* Related opportunities */}
      {related.length > 0 && (
        <View style={styles.related}>
          <SectionHeader
            title="Related Opportunities"
            actionLabel="View all"
            onAction={() => router.push('/(tabs)/opportunities')}
          />
          {related.map((o) => (
            <GlassCard
              key={o.id}
              onPress={() => router.push({ pathname: '/opportunity/[id]', params: { id: o.id } })}
              style={styles.relCard}
            >
              <View style={styles.relRow}>
                <View style={styles.relText}>
                  <Txt variant="bodyStrong" numberOfLines={1}>
                    {o.title}
                  </Txt>
                  <Txt variant="caption" style={{ color: Colors.textSecondary, marginTop: 2 }}>
                    {o.provider}
                  </Txt>
                </View>
                <StatusBadge status={o.status} />
              </View>
            </GlassCard>
          ))}
        </View>
      )}

      {/* CTAs */}
      <View style={styles.ctas}>
        <Button label="Inquire Now" icon="document-text-outline" onPress={() => router.push('/login')} />
        <Button
          label="Chat About This"
          variant="secondary"
          icon="chatbubble-ellipses-outline"
          onPress={() => router.push('/login')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  headerText: { flex: 1, gap: 4 },
  summary: { marginTop: Spacing.xl, fontSize: 15, lineHeight: 23 },
  sectionLabel: { marginTop: Spacing.xxl, marginBottom: Spacing.md },
  benefitsCard: {},
  benefit: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
  benefitBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
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
  benefitText: { flex: 1 },
  related: { marginTop: Spacing.xxl },
  relCard: { marginBottom: Spacing.md },
  relRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  relText: { flex: 1 },
  ctas: { marginTop: Spacing.xxl, gap: Spacing.md },
});
