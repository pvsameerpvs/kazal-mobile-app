import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/theme';
import { Txt } from './Txt';

export function SectionHeader({
  title,
  overline,
  actionLabel,
  onAction,
}: {
  title: string;
  overline?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {overline && <Txt variant="overline">{overline}</Txt>}
        <Txt variant="h2">{title}</Txt>
      </View>
      {actionLabel && (
        <Pressable style={styles.action} onPress={onAction} hitSlop={8}>
          <Txt variant="label" style={{ color: Colors.cyan }}>
            {actionLabel}
          </Txt>
          <Ionicons name="chevron-forward" size={14} color={Colors.cyan} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  left: { gap: 4, flex: 1 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingBottom: 2 },
});
