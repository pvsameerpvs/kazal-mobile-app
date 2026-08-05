import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/theme';
import type { SubCategory } from '@/types';
import { GlassCard } from './GlassCard';
import { IconTile } from './IconTile';
import { Txt } from './Txt';

export function SubCategoryCard({ item, onPress }: { item: SubCategory; onPress?: () => void }) {
  return (
    <GlassCard onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <IconTile icon={item.icon} size={40} iconSize={20} glowing={false} />
        <View style={styles.text}>
          <Txt variant="title" numberOfLines={1}>
            {item.title}
          </Txt>
          <Txt variant="body" numberOfLines={2}>
            {item.caption}
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
