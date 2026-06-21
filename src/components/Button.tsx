import { Pressable, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Radius, Spacing, Type, glow } from '@/theme';
import { Txt } from './Txt';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  trailingIcon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: StyleProp<ViewStyle>;
  full?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  trailingIcon,
  style,
  full = true,
}: Props) {
  const isPrimary = variant === 'primary';
  const textColor = isPrimary ? Colors.white : Colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        full && styles.full,
        isPrimary ? glow(Colors.glowCyan, 16) : null,
        !isPrimary && styles.secondary,
        pressed && styles.pressed,
        style,
      ]}
    >
      {isPrimary && (
        <LinearGradient
          colors={Gradients.cta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.content}>
        {icon && <Ionicons name={icon} size={18} color={textColor} />}
        <Txt style={[Type.bodyStrong, { color: textColor, fontSize: 15 }]}>{label}</Txt>
        {trailingIcon && <Ionicons name={trailingIcon} size={18} color={textColor} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: Radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { alignSelf: 'stretch' },
  secondary: {
    backgroundColor: Colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
