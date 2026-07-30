import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/theme';
import { Txt } from '@/components';
import { formatDateSeparator } from '@/utils/chat';

type Props = {
  date: Date;
};

export function ChatDateSeparator({ date }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Txt variant="caption" style={styles.label}>
        {formatDateSeparator(date)}
      </Txt>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  label: {
    marginHorizontal: Spacing.md,
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
