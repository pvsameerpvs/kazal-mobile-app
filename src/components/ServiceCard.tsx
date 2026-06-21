import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/theme';
import type { Service } from '@/types';
import { GlassCard } from './GlassCard';
import { IconTile } from './IconTile';
import { Txt } from './Txt';

export function ServiceCard({ service, onPress }: { service: Service; onPress?: () => void }) {
  return (
    <GlassCard onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <IconTile icon={service.icon} />
        <View style={styles.text}>
          <Txt variant="title">{service.title}</Txt>
          <Txt variant="body" numberOfLines={1}>
            {service.summary}
          </Txt>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  text: { flex: 1, gap: 3 },
});
