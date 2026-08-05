import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/theme';
import {
  Screen,
  AnimatedIn,
  HomeHero,
  GlassCard,
  IconTile,
  SectionHeader,
  OpportunityCard,
  Txt,
} from '@/components';
import { quickAccess, opportunities } from '@/data';

const EXPANDED = 0.40;
const COLLAPSED = 0.2;

export default function Home() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const maxH = height * EXPANDED + insets.top;
  const minH = height * COLLAPSED + insets.top;
  const range = maxH - minH;

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, range], [maxH, minH], Extrapolation.CLAMP),
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100], [1, 0], Extrapolation.CLAMP),
  }));

  const openOpportunity = (id: string) =>
    router.push({ pathname: '/opportunity/[id]', params: { id } });

  return (
    <Screen scroll={false} contentStyle={styles.content}>
      {/* Portion one — collapses 55% → 20% then pins */}
      <Animated.View style={[styles.header, { top: -insets.top }, headerStyle]}>
        <HomeHero ctaStyle={ctaStyle} />
      </Animated.View>

      {/* Portion two — scrolls under the pinned header */}
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: maxH }]}
      >
        <AnimatedIn index={1}>
          <Txt variant="h3" style={styles.sectionLabel}>
            Quick Access
          </Txt>
          <View style={styles.quickRow}>
            {quickAccess.map((q) => (
              <GlassCard key={q.id} onPress={() => router.push(q.href)} style={styles.quickCard}>
                <View style={styles.quickInner}>
                  <IconTile icon={q.icon} size={44} iconSize={20} glowing={false} />
                  <Txt variant="bodyStrong" numberOfLines={1}>
                    {q.label}
                  </Txt>
                </View>
              </GlassCard>
            ))}
          </View>
        </AnimatedIn>

        <AnimatedIn index={2}>
          <View style={styles.latest}>
            <SectionHeader
              title="Latest Opportunities"
              actionLabel="View All"
              onAction={() => router.push('/(tabs)/opportunities')}
            />
            {opportunities.slice(0, 2).map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} onPress={() => openOpportunity(opp.id)} />
            ))}
          </View>
        </AnimatedIn>
      </Animated.ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
  quickRow: { flexDirection: 'row', gap: Spacing.lg },
  quickCard: { flex: 1 },
  quickInner: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  sectionLabel: { marginBottom: Spacing.lg, color: Colors.textSecondary },
  latest: { marginTop: Spacing.xxxl },
});
