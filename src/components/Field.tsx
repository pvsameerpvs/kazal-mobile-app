import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Type } from '@/theme';
import { Txt } from './Txt';

type Base = {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder: string;
};

/** Text input field with a leading icon — matches the glass form aesthetic. */
export function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
}: Base & {
  value?: string;
  onChangeText?: (t: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}) {
  return (
    <View style={[styles.field, multiline && styles.multiline]}>
      {icon && <Ionicons name={icon} size={18} color={Colors.textMuted} style={multiline && styles.iconTop} />}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        style={[styles.input, multiline && styles.inputMultiline]}
        selectionColor={Colors.cyan}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

/** Read-only select-style field (static dropdown affordance). */
export function SelectField({
  icon,
  placeholder,
  value,
  onPress,
}: Base & { value?: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.field} onPress={onPress}>
      {icon && <Ionicons name={icon} size={18} color={Colors.textMuted} />}
      <Txt variant="body" style={[styles.input, value ? { color: Colors.text } : undefined]}>
        {value || placeholder}
      </Txt>
      <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  multiline: { minHeight: 96, alignItems: 'flex-start', paddingVertical: Spacing.md },
  iconTop: { marginTop: 2 },
  input: { flex: 1, color: Colors.text, ...Type.body, paddingVertical: 0 },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top', paddingTop: 0 },
});
