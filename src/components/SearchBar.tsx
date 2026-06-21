import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Type } from '@/theme';

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search…',
  onFilter,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onFilter?: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          selectionColor={Colors.cyan}
        />
      </View>
      {onFilter && (
        <Pressable style={styles.filterBtn} onPress={onFilter}>
          <Ionicons name="options-outline" size={20} color={Colors.cyan} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  field: {
    flex: 1,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  input: { flex: 1, color: Colors.text, ...Type.body, paddingVertical: 0 },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
