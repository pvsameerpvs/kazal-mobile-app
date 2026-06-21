import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { Colors } from '@/theme';

/**
 * Subtle futuristic skyline silhouette — a premium business-city motif used
 * behind hero / office / login panels. Purely decorative.
 */
export function Skyline({
  height = 140,
  opacity = 0.5,
  style,
}: {
  height?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View pointerEvents="none" style={[styles.wrap, { height, opacity }, style]}>
      <Svg width="100%" height={height} viewBox="0 0 400 160" preserveAspectRatio="xMidYMax meet">
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.cyan} stopOpacity="0.9" />
            <Stop offset="1" stopColor={Colors.blue} stopOpacity="0.15" />
          </LinearGradient>
        </Defs>
        {/* Building blocks */}
        <Rect x="18" y="92" width="26" height="68" fill="url(#sky)" />
        <Rect x="50" y="64" width="30" height="96" fill="url(#sky)" />
        <Rect x="86" y="104" width="22" height="56" fill="url(#sky)" />
        <Rect x="116" y="44" width="24" height="116" fill="url(#sky)" />
        {/* Central spire (Burj-like) */}
        <Path d="M168 160 L182 24 L196 160 Z" fill="url(#sky)" />
        <Rect x="176" y="14" width="12" height="20" fill="url(#sky)" />
        <Rect x="208" y="72" width="28" height="88" fill="url(#sky)" />
        <Rect x="242" y="100" width="20" height="60" fill="url(#sky)" />
        <Rect x="270" y="54" width="30" height="106" fill="url(#sky)" />
        <Rect x="306" y="86" width="24" height="74" fill="url(#sky)" />
        <Rect x="336" y="68" width="28" height="92" fill="url(#sky)" />
        <Rect x="370" y="110" width="18" height="50" fill="url(#sky)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
