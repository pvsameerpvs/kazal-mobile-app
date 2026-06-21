import { ReactNode, useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  index?: number;
  delay?: number;
};

export function AnimatedIn({ children, index = 0, delay = 80 }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    const d = index * delay;
    opacity.value = withDelay(d, withTiming(1, { duration: 450 }));
    translateY.value = withDelay(d, withSpring(0, { damping: 22, stiffness: 160 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
