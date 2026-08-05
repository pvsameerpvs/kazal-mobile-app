import { forwardRef, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Href, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Gradients } from '@/theme';
import { Txt } from '@/components';

type TabDef = {
  name: string;
  href: Href;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  { name: 'home', href: '/(tabs)/home', label: 'Home', icon: 'home-outline', active: 'home' },
  { name: 'services', href: '/(tabs)/services', label: 'Services', icon: 'briefcase-outline', active: 'briefcase' },
  { name: 'opportunities', href: '/(tabs)/opportunities', label: 'Deals', icon: 'trending-up-outline', active: 'trending-up' },
  { name: 'chat', href: '/(tabs)/chat', label: 'Chat', icon: 'chatbubbles-outline', active: 'chatbubbles' },
  { name: 'profile', href: '/(tabs)/profile', label: 'Profile', icon: 'person-outline', active: 'person' },
];

type ButtonProps = TabTriggerSlotProps & {
  icon: keyof typeof Ionicons.glyphMap;
  active: keyof typeof Ionicons.glyphMap;
  label: string;
};

const TabButton = forwardRef<View, ButtonProps>(({ icon, active, label, isFocused, ...props }, ref) => {
  const bgOpacity = useSharedValue(isFocused ? 1 : 0);
  const bgScale = useSharedValue(isFocused ? 1 : 0.8);
  const iconScale = useSharedValue(isFocused ? 1 : 0.92);

  useEffect(() => {
    bgOpacity.value = withSpring(isFocused ? 1 : 0, { damping: 20, stiffness: 220 });
    bgScale.value = withSpring(isFocused ? 1 : 0.8, { damping: 20, stiffness: 220 });
    iconScale.value = withSpring(isFocused ? 1 : 0.92, { damping: 14, stiffness: 200 });
  }, [isFocused]);

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
    transform: [{ scale: bgScale.value }],
  }));

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <Pressable ref={ref} {...props} style={styles.tab}>
      <Animated.View style={[styles.iconWrap, iconAnimStyle]}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.activeBg, bgStyle]}>
          <LinearGradient colors={Gradients.cta} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <Ionicons
          name={isFocused ? active : icon}
          size={22}
          color={isFocused ? Colors.white : Colors.textMuted}
        />
      </Animated.View>
      <Txt
        variant="caption"
        style={{
          color: isFocused ? Colors.white : Colors.textMuted,
          fontWeight: isFocused ? '700' : '500',
          fontSize: 10,
        }}
      >
        {label}
      </Txt>
    </Pressable>
  );
});
TabButton.displayName = 'TabButton';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const hideTabBar = segments.length > 1 && segments[1] === 'chat';

  return (
    <Tabs style={styles.root}>
      <TabSlot />
      <TabList
        style={[styles.bar, { bottom: Math.max(insets.bottom - 4, 8) }, hideTabBar && styles.hidden]}
      >
        {TABS.map((t) => (
          <TabTrigger key={t.name} name={t.name} href={t.href} asChild>
            <TabButton icon={t.icon} active={t.active} label={t.label} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  bar: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl + 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(11,20,36,0.85)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(43,210,255,0.08)',
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.08,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 6 },
    elevation: 16,
  },
  hidden: { opacity: 0, pointerEvents: 'none' },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 6,
  },
  activeBg: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  iconWrap: {
    width: 44,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
