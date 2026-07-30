import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '@/theme';
import { Txt } from '@/components';

export function ChatTypingIndicator() {
  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <View style={[styles.dot, { animationDelay: '0s' }]} />
        <View style={[styles.dot, { animationDelay: '0.2s' }]} />
        <View style={[styles.dot, { animationDelay: '0.4s' }]} />
      </View>
      <Txt variant="caption" style={styles.text}>
        Advisor is typing...
      </Txt>
    </View>
  );
}

const DOT_SIZE = 7;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.sm,
    marginTop: Spacing.xs,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: 4,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.textMuted,
    opacity: 0.6,
  },
  text: {
    color: Colors.textMuted,
    marginLeft: 8,
  },
});
