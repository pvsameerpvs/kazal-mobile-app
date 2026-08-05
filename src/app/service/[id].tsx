import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/theme';
import {
  Screen,
  TopBar,
  GlassCard,
  Button,
  StatusBadge,
  SectionHeader,
  SubCategoryCard,
  Txt,
} from '@/components';
import { services, opportunities } from '@/data';

export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const service = services.find((s) => s.id === id) ?? services[0];

  const inquire = (label: string) =>
    router.push({ pathname: '/(tabs)/chat', params: { context: 'service', label } });

  const keyword = service.title.split(' ')[0].toLowerCase();
  const related = opportunities
    .filter((o) => o.instrument.toLowerCase().includes(keyword))
    .concat(opportunities.filter((o) => o.status === 'Available'))
    .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i)
    .slice(0, 2);

  return (
    <Screen edges={['bottom']} contentStyle={styles.content}>
      {/* Hero image — full bleed incl. top safe area */}
      <View style={[styles.hero, { height: 280 + insets.top, paddingTop: insets.top }]}>
        <Image
          source={{ uri: service.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessibilityLabel={service.title}
        />
        <LinearGradient
          colors={['rgba(43,210,255,0.16)', 'rgba(5,8,15,0.42)', 'rgba(5,8,15,0.60)', Colors.bg]}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={styles.edgeHighlight} />
        <TopBar title="Service" />
        <View style={styles.heroContent}>
          <Txt variant="h1">{service.title}</Txt>
          <Txt variant="body" style={styles.heroSummary}>
            {service.summary}
          </Txt>
        </View>
      </View>

      <Txt variant="body" style={styles.summary}>
        {service.description}
      </Txt>

      {/* Sub categories */}
      <View style={styles.sectionBlock}>
        <SectionHeader title="Sub Categories" overline="Explore" />
        {service.subCategories.map((sc) => (
          <SubCategoryCard key={sc.title} item={sc} onPress={() => inquire(sc.title)} />
        ))}
      </View>

      {/* Key features */}
      <View style={styles.sectionBlock}>
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
      </View>

      {/* Related opportunities */}
      {related.length > 0 && (
        <View style={styles.sectionBlock}>
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
        <Button
          label="Inquire Now"
          icon="document-text-outline"
          onPress={() => inquire(service.title)}
        />
        <Button
          label="Chat About This"
          variant="secondary"
          icon="chatbubble-ellipses-outline"
          onPress={() => inquire(service.title)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxxl },
  hero: {
    marginHorizontal: -Spacing.xl,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  edgeHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  heroSummary: { color: Colors.textSecondary },
  summary: { marginTop: Spacing.xl, fontSize: 15, lineHeight: 23 },
  sectionBlock: { marginTop: Spacing.xxl },
  sectionLabel: { marginBottom: Spacing.md },
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
  relCard: { marginBottom: Spacing.md },
  relRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  relText: { flex: 1 },
  ctas: { marginTop: Spacing.xxl, gap: Spacing.md },
});
