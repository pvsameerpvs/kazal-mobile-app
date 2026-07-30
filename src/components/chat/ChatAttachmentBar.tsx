import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/theme';
import { Txt } from '@/components';
import type { PendingAttachment } from '@/types';

type Props = {
  attachment: PendingAttachment;
  onClear: () => void;
};

export function ChatAttachmentBar({ attachment, onClear }: Props) {
  return (
    <View style={styles.bar}>
      {attachment.type === 'image' ? (
        <Image source={{ uri: attachment.uri }} style={styles.image} />
      ) : (
        <View style={styles.file}>
          <Ionicons name="document-text" size={22} color={Colors.cyan} />
          <View style={styles.fileInfo}>
            <Txt variant="bodyStrong" numberOfLines={1} style={styles.fileName}>
              {attachment.name}
            </Txt>
            {attachment.size && (
              <Txt variant="caption" style={styles.fileSize}>
                {attachment.size}
              </Txt>
            )}
          </View>
        </View>
      )}
      <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
        <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
      </TouchableOpacity>
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
    gap: Spacing.sm,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: Radius.sm,
  },
  file: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fileInfo: { flex: 1 },
  fileName: {
    color: Colors.text,
    fontSize: 13,
  },
  fileSize: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  clearBtn: { padding: 4 },
});
