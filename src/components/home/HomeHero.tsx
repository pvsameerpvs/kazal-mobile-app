import { company } from "@/data";
import { Colors, Spacing } from "@/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../Button";
import { Txt } from "../Txt";

type Props = {
  ctaStyle?: StyleProp<ViewStyle>;
};

/** Hero image that fills its parent (height animated by the collapsing header). */
export function HomeHero({ ctaStyle }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.hero, { paddingTop: insets.top + Spacing.sm }]}>
      <Image
        source={require("@/assets/images/home/home1.jpeg")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessibilityLabel="Prime Capital Advisory banner"
      />
      <LinearGradient
        colors={[
          "rgba(43,210,255,0.16)",
          "rgba(5,8,15,0.42)",
          "rgba(5,8,15,0.60)",
          Colors.bg,
        ]}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.edgeHighlight} />

      <View style={styles.topRow}>
        <View style={styles.greetBlock}>
          <Txt variant="h2">Aircraft financing</Txt>
          <Txt variant="body" style={styles.trust}>
            We at {company.name} offer complete aviation needs and services. We
            can provide you with the aircraft you need, whether Boeing or
            Airbus, new or used, from commercial, VIP, executive to private jet.
          </Txt>
        </View>
      </View>

      <Animated.View style={ctaStyle}>
        <Button
          label="Learn More"
          variant="secondary"
          onPress={() => router.push("/(tabs)/services")}
          style={styles.ctaButton}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetBlock: { gap: 2, flex: 1, paddingRight: Spacing.md },
  edgeHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  trust: { marginTop: Spacing.md, color: Colors.textSecondary },
  ctaButton: {
    width: "85%",
    maxWidth: 300,
    alignSelf: "center",
  },
});
