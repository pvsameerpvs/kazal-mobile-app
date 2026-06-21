import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, StyleProp, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients, Spacing } from '@/theme';
import { GlowBackground } from './GlowBackground';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** Render a glow-free flat background (e.g. chat). */
  flat?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Screen({
  children,
  scroll = true,
  padded = true,
  contentStyle,
  flat = false,
  edges = ['top'],
}: Props) {
  const inner = padded ? styles.padded : undefined;
  // On web, bound the screen to the viewport so the inner ScrollView scrolls
  // (the navigator's screen wrappers are flex-shrink:0 and otherwise grow to content).
  const { height } = useWindowDimensions();
  const webBound = Platform.OS === 'web' ? { maxHeight: height } : null;

  return (
    <View style={[styles.root, webBound]}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />
      {!flat && <GlowBackground />}
      <SafeAreaView style={styles.safe} edges={edges}>
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[inner, styles.scrollPad, contentStyle]}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, inner, contentStyle]}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1 },
  flex: { flex: 1 },
  padded: { paddingHorizontal: Spacing.xl },
  scrollPad: { paddingBottom: Spacing.xxxl },
});
