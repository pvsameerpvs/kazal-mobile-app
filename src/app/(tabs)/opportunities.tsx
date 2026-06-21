import { useMemo, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing } from '@/theme';
import { Screen, ScreenTitle, AnimatedIn, Chip, OpportunityCard } from '@/components';
import { opportunities, oppTabs } from '@/data/mock';

export default function Opportunities() {
  const router = useRouter();
  const [tab, setTab] = useState<string>('All');

  const filtered = useMemo(
    () => opportunities.filter((o) => tab === 'All' || o.tag === tab),
    [tab],
  );

  return (
    <Screen contentStyle={styles.content}>
      <ScreenTitle title="Available Opportunities" avatar />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {oppTabs.map((t) => (
          <Chip key={t} label={t} active={t === tab} onPress={() => setTab(t)} />
        ))}
      </ScrollView>

      {filtered.map((o, i) => (
        <AnimatedIn key={o.id} index={i}>
          <OpportunityCard
            opp={o}
            onPress={() => router.push({ pathname: '/opportunity/[id]', params: { id: o.id } })}
          />
        </AnimatedIn>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  chipsScroll: { marginBottom: Spacing.lg },
  chips: { gap: Spacing.sm, paddingRight: Spacing.xl },
});
