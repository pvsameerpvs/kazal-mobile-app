import { View, StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import type { OppStatus } from '@/types';
import { Txt } from './Txt';

const MAP: Record<OppStatus, string> = {
  Available: Colors.available,
  'In Discussion': Colors.limited,
};

export function StatusBadge({ status, large = false }: { status: OppStatus; large?: boolean }) {
  const color = MAP[status];
  return (
    <View style={[styles.badge, { borderColor: color + '55', backgroundColor: color + '1A' }, large && styles.large]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Txt variant="caption" style={{ color, fontWeight: '700', fontSize: large ? 12 : 11 }}>
        {status}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
  large: { paddingHorizontal: 11, paddingVertical: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
