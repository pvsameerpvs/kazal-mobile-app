import { View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/theme';
import { Txt } from '@/components';

type AttachOption = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onDocument: () => void;
};

export function ChatAttachMenu({ visible, onClose, onCamera, onGallery, onDocument }: Props) {
  if (!visible) return null;

  const options: AttachOption[] = [
    { key: 'camera', label: 'Camera', icon: 'camera', color: '#FF5A5F', onPress: onCamera },
    { key: 'gallery', label: 'Gallery', icon: 'images', color: '#00C875', onPress: onGallery },
    { key: 'document', label: 'Document', icon: 'document', color: '#2BD2FF', onPress: onDocument },
    { key: 'location', label: 'Location', icon: 'location', color: '#AA82FF', onPress: onClose },
  ];

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable style={styles.menu}>
        <View style={styles.handle} />
        <Txt variant="title" style={styles.title}>Share</Txt>
        <View style={styles.grid}>
          {options.map((opt) => (
            <TouchableOpacity key={opt.key} style={styles.item} onPress={opt.onPress}>
              <View style={[styles.iconWrap, { backgroundColor: opt.color + '26' }]}>
                <Ionicons name={opt.icon} size={26} color={opt.color} />
              </View>
              <Txt variant="caption" style={{ color: Colors.textSecondary, marginTop: 4 }}>
                {opt.label}
              </Txt>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  menu: {
    backgroundColor: Colors.bgRaised,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.textMuted,
    alignSelf: 'center', marginBottom: Spacing.lg, opacity: 0.4,
  },
  title: { textAlign: 'center', marginBottom: Spacing.lg },
  grid: {
    flexDirection: 'row', justifyContent: 'space-around',
    gap: Spacing.md,
  },
  item: { alignItems: 'center', gap: 2, width: 72 },
  iconWrap: {
    width: 60, height: 60, borderRadius: Radius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
});
