import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Radius } from '@/theme';
import { Icon } from './Icon';
import type { IconRef } from '@/types';

/** Rounded glass tile holding an accent icon — used for services & contacts. */
export function IconTile({
  icon,
  size = 48,
  iconSize = 22,
  color = Colors.cyan,
  glowing = true,
  style,
}: {
  icon: IconRef;
  size?: number;
  iconSize?: number;
  color?: string;
  glowing?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: Radius.md },
        glowing && {
          shadowColor: Colors.glowCyan,
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    >
      <LinearGradient colors={Gradients.ctaSoft} style={[StyleSheet.absoluteFill, { borderRadius: Radius.md }]} />
      <Icon icon={icon} size={iconSize} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    overflow: 'hidden',
  },
});
