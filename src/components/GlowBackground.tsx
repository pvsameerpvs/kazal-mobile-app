import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { Colors } from '@/theme';

/**
 * Decorative ambient glows behind screen content — soft cyan/blue radial
 * blooms that give the dark UI its premium, immersive depth.
 */
export function GlowBackground({ style }: { style?: ViewStyle }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="g1" cx="18%" cy="8%" r="55%">
            <Stop offset="0" stopColor={Colors.blue} stopOpacity="0.35" />
            <Stop offset="1" stopColor={Colors.blue} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g2" cx="92%" cy="30%" r="50%">
            <Stop offset="0" stopColor={Colors.cyan} stopOpacity="0.22" />
            <Stop offset="1" stopColor={Colors.cyan} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g3" cx="50%" cy="108%" r="60%">
            <Stop offset="0" stopColor={Colors.teal} stopOpacity="0.18" />
            <Stop offset="1" stopColor={Colors.teal} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g2)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g3)" />
      </Svg>
    </View>
  );
}
