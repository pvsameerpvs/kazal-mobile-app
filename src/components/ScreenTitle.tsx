import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '@/theme';
import { Txt } from './Txt';

/** Large screen title for tab roots: heading + subtitle + cyan underline. */
export function ScreenTitle({
  title,
  subtitle,
  avatar = false,
}: {
  title: string;
  subtitle?: string;
  avatar?: boolean;
}) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Txt variant="h1">{title}</Txt>
          {subtitle && (
            <Txt variant="body" style={{ marginTop: 4 }}>
              {subtitle}
            </Txt>
          )}
        </View>
        {avatar && (
          <Pressable style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person" size={18} color={Colors.textSecondary} />
          </Pressable>
        )}
      </View>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: Spacing.sm, marginBottom: Spacing.xl },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  flex: { flex: 1 },
  underline: {
    width: 48,
    height: 3,
    borderRadius: 3,
    backgroundColor: Colors.cyan,
    marginTop: Spacing.md,
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
