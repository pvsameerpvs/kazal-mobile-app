import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { Colors, glow } from '@/theme';

/**
 * MET Holdings "M" monogram — an angular two-tone mark drawn with a
 * cyan→blue diagonal gradient, echoing the premium reference brand.
 */
export function Logo({ size = 44, glowing = true }: { size?: number; glowing?: boolean }) {
  return (
    <View style={glowing ? glow(Colors.glowCyan, 14) : undefined}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="m" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={Colors.cyanSoft} />
            <Stop offset="0.5" stopColor={Colors.cyan} />
            <Stop offset="1" stopColor={Colors.blue} />
          </LinearGradient>
        </Defs>
        {/* Left blade */}
        <Path d="M16 104 L16 22 L34 22 L52 60 L44 78 L34 56 L34 104 Z" fill="url(#m)" opacity={0.95} />
        {/* Right blade */}
        <Path d="M104 104 L104 22 L86 22 L68 60 L76 78 L86 56 L86 104 Z" fill="url(#m)" opacity={0.95} />
        {/* Center wedge */}
        <Path d="M52 60 L60 44 L68 60 L60 92 Z" fill="url(#m)" opacity={0.75} />
      </Svg>
    </View>
  );
}
