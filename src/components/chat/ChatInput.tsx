import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Spacing, Type } from '@/theme';
import { isIOS } from '@/constants/layout';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach: () => void;
  hasAttachment: boolean;
  keyboardVisible: boolean;
  bottomPadding: number;
};

export function ChatInput({
  value, onChangeText, onSend, onAttach, hasAttachment, keyboardVisible, bottomPadding,
}: Props) {
  const canSend = value.trim().length > 0 || hasAttachment;

  return (
    <View style={[styles.bar, { paddingBottom: keyboardVisible ? Spacing.sm : Math.max(bottomPadding, Spacing.sm) }]}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.attachBtn} onPress={onAttach}>
          <Ionicons name="add-circle" size={26} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.inputWrap}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Message"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            selectionColor={Colors.cyan}
            multiline
            maxLength={4096}
          />
        </View>

        {canSend ? (
          <TouchableOpacity style={styles.sendBtn} onPress={onSend} activeOpacity={0.7}>
            <LinearGradient colors={Gradients.cta} style={StyleSheet.absoluteFill} />
            <Ionicons name="send" size={16} color={Colors.white} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
            <Ionicons name="mic-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  attachBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  inputWrap: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    maxHeight: 100,
  },
  input: {
    color: Colors.text,
    ...Type.body,
    fontSize: 15,
    paddingVertical: isIOS ? 10 : 8,
    maxHeight: 80,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', marginBottom: 4,
  },
  micBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
});
