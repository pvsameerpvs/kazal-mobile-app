import { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Spacing, Type } from '@/theme';
import { GlowBackground, Button, Logo, Txt } from '@/components';

export default function Login() {
  const router = useRouter();
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');

  const proceed = () => router.replace('/(tabs)/chat');

  return (
    <View style={styles.root}>
      <LinearGradient colors={Gradients.screen} style={StyleSheet.absoluteFill} />
      <GlowBackground />
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.grabber} />
        <Pressable style={styles.close} hitSlop={10} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={Colors.textSecondary} />
        </Pressable>

        <View style={styles.body}>
          {/* Lock mark */}
          <View style={styles.lockRing}>
            <View style={styles.lockInner}>
              <Logo size={40} />
            </View>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={13} color={Colors.bg} />
            </View>
          </View>

          <Txt variant="h1" style={styles.title}>
            Secure Access
          </Txt>
          <Txt variant="body" style={styles.subtitle}>
            Sign in to inquire and chat securely with our advisory team. It only takes a moment.
          </Txt>

          {/* Method toggle */}
          <View style={styles.toggle}>
            <ToggleBtn label="Phone" icon="call-outline" active={method === 'phone'} onPress={() => setMethod('phone')} />
            <ToggleBtn label="Email" icon="mail-outline" active={method === 'email'} onPress={() => setMethod('email')} />
          </View>

          {/* Input */}
          {method === 'phone' ? (
            <View style={styles.inputRow}>
              <View style={styles.prefix}>
                <Txt variant="bodyStrong">🇦🇪 +971</Txt>
              </View>
              <TextInput
                value={value}
                onChangeText={setValue}
                placeholder="50 123 4567"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                style={styles.input}
                selectionColor={Colors.cyan}
              />
            </View>
          ) : (
            <View style={styles.inputRow}>
              <View style={styles.inlineIcon}>
                <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
              </View>
              <TextInput
                value={value}
                onChangeText={setValue}
                placeholder="you@company.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                selectionColor={Colors.cyan}
              />
            </View>
          )}

          <Button
            label={method === 'phone' ? 'Send OTP Code' : 'Continue with Email'}
            trailingIcon="arrow-forward"
            onPress={proceed}
            style={styles.cta}
          />

          {/* Reassurance */}
          <View style={styles.reassure}>
            <Ionicons name="shield-checkmark" size={15} color={Colors.cyan} />
            <Txt variant="caption" style={{ color: Colors.textSecondary, flex: 1 }}>
              Your details are encrypted, verified and never shared. We'll send a one-time code to confirm it's you.
            </Txt>
          </View>
        </View>

        <Txt variant="caption" style={styles.terms}>
          By continuing you agree to our Terms & Privacy Policy
        </Txt>
      </SafeAreaView>
    </View>
  );
}

function ToggleBtn({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.toggleBtn, active && styles.toggleActive]} onPress={onPress}>
      <Ionicons name={icon} size={16} color={active ? Colors.cyan : Colors.textMuted} />
      <Txt variant="bodyStrong" style={{ color: active ? Colors.text : Colors.textMuted, fontSize: 14 }}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  safe: { flex: 1, paddingHorizontal: Spacing.xl },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.glassHairline, alignSelf: 'center', marginTop: Spacing.sm },
  close: { position: 'absolute', top: Spacing.lg, right: Spacing.xl, width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassStrong, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lockRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    backgroundColor: 'rgba(43,210,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.glowCyan,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  lockInner: { alignItems: 'center', justifyContent: 'center' },
  lockBadge: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bg,
  },
  title: { marginTop: Spacing.xxl },
  subtitle: { textAlign: 'center', marginTop: Spacing.md, maxWidth: 320 },
  toggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xxl,
    padding: 4,
    borderRadius: Radius.md,
    backgroundColor: Colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignSelf: 'stretch',
  },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44, borderRadius: Radius.sm },
  toggleActive: { backgroundColor: Colors.glassStrong, borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.borderAccent },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: Spacing.lg,
    height: 54,
    borderRadius: Radius.md,
    backgroundColor: Colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  prefix: {
    paddingHorizontal: Spacing.lg,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: Colors.border,
  },
  inlineIcon: { paddingLeft: Spacing.lg },
  input: { flex: 1, color: Colors.text, ...Type.body, fontSize: 16, paddingHorizontal: Spacing.lg },
  cta: { marginTop: Spacing.lg, alignSelf: 'stretch' },
  reassure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  terms: { textAlign: 'center', color: Colors.textMuted, marginBottom: Spacing.md },
});
