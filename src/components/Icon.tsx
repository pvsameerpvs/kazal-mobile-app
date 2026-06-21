import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { IconRef } from '@/types';
import { Colors } from '@/theme';

export function Icon({
  icon,
  size = 22,
  color = Colors.cyan,
}: {
  icon: IconRef;
  size?: number;
  color?: string;
}) {
  if (icon.set === 'mci') {
    return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
  }
  return <Ionicons name={icon.name} size={size} color={color} />;
}
