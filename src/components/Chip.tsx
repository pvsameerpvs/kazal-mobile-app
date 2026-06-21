import { Pressable, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '@/theme';
import { Txt } from './Txt';

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.active : styles.inactive]}
    >
      <Txt
        variant="label"
        style={{ color: active ? Colors.bg : Colors.textSecondary, fontWeight: '700' }}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.lg,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  active: {
    backgroundColor: Colors.cyan,
    borderColor: Colors.cyan,
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  inactive: {
    backgroundColor: Colors.glass,
    borderColor: Colors.border,
  },
});
