import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/theme';
import { Txt } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import type { ChatMessage } from '@/types';

type Props = {
  message: ChatMessage;
  onClose: () => void;
};

export function ChatReplyBar({ message, onClose }: Props) {
  const owner = message.from === 'me' ? 'You' : 'Advisor';

  return (
    <View style={styles.bar}>
      <View style={styles.handle} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Txt variant="caption" style={styles.owner}>
            {owner}
          </Txt>
          <TouchableOpacity hitSlop={8} onPress={onClose}>
            <Ionicons name="close" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Txt variant="caption" style={styles.preview} numberOfLines={1}>
          {message.text ?? (message.image ? '🖼 Photo' : message.file ? `📄 ${message.file.name}` : '')}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgRaised,
  },
  handle: {
    width: 3,
    height: '100%',
    borderRadius: 2,
    backgroundColor: Colors.cyan,
    marginRight: Spacing.sm,
  },
  content: { flex: 1, gap: 2 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  owner: {
    color: Colors.cyan,
    fontWeight: '700',
    fontSize: 12,
  },
  preview: {
    color: Colors.textSecondary,
  },
});
