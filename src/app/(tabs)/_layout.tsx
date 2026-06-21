import { forwardRef } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing } from '@/theme';
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
  return (
    <Pressable ref={ref} {...props} style={styles.tab}>
      <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
        <Ionicons name={isFocused ? active : icon} size={22} color={isFocused ? Colors.cyan : Colors.textMuted} />
      </View>
      <Txt
        variant="caption"
        style={{ color: isFocused ? Colors.cyan : Colors.textMuted, fontWeight: isFocused ? '700' : '500', fontSize: 10 }}
      >
        {label}
      </Txt>
    </Pressable>
  );
});
TabButton.displayName = 'TabButton';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs style={styles.root}>
      <TabSlot />
      <TabList style={[styles.bar, { bottom: Math.max(insets.bottom, 12) }]}>
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
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.glassHairline,
    backgroundColor: 'rgba(9,16,30,0.94)',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 },
  iconWrap: {
    width: 44,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(43,210,255,0.12)',
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});
