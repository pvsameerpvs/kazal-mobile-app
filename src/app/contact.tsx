import { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '@/theme';
import { Screen, TopBar, GlassCard, Button, Field, SelectField, Skyline, Txt } from '@/components';
import { company } from '@/data/mock';

type Contact = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  accent?: boolean;
};

const contacts: Contact[] = [
  { id: 'wa', title: 'WhatsApp', subtitle: 'Chat with us', icon: 'logo-whatsapp', color: '#25D366', accent: true },
  { id: 'email', title: 'Email', subtitle: company.email, icon: 'mail-outline', color: Colors.cyan },
  { id: 'phone', title: 'Phone', subtitle: company.phone, icon: 'call-outline', color: Colors.teal },
  { id: 'linkedin', title: 'LinkedIn', subtitle: 'Follow us', icon: 'logo-linkedin', color: '#0A66C2' },
];

export default function ContactScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - Spacing.xl * 2 - Spacing.md) / 2;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Screen contentStyle={styles.content}>
      <TopBar />
      <Txt variant="h1">Contact Us</Txt>
      <Txt variant="body" style={{ marginTop: 4 }}>
        Connect with our advisory team
      </Txt>
      <View style={styles.underline} />

      {/* Quick contact grid */}
      <View style={styles.grid}>
        {contacts.map((c) => (
          <GlassCard key={c.id} accent={c.accent} onPress={() => {}} style={[styles.contactCard, { width: cardWidth }]}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { borderColor: c.color + '55', backgroundColor: c.color + '1A' }]}>
                <Ionicons name={c.icon} size={20} color={c.color} />
              </View>
              <View style={styles.flex}>
                <Txt variant="bodyStrong">{c.title}</Txt>
                <Txt variant="caption" style={{ color: Colors.textSecondary }} numberOfLines={1}>
                  {c.subtitle}
                </Txt>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </View>
          </GlassCard>
        ))}
      </View>

      {/* Instagram full width */}
      <GlassCard onPress={() => {}} style={styles.instagram}>
        <View style={styles.contactRow}>
          <View style={[styles.contactIcon, { borderColor: '#E1306C55', backgroundColor: '#E1306C1A' }]}>
            <Ionicons name="logo-instagram" size={20} color="#E1306C" />
          </View>
          <View style={styles.flex}>
            <Txt variant="bodyStrong">Instagram</Txt>
            <Txt variant="caption" style={{ color: Colors.textSecondary }}>
              {company.instagram}
            </Txt>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </View>
      </GlassCard>

      {/* Inquiry form */}
      <GlassCard style={styles.form}>
        <Txt variant="h3">Send us an Inquiry</Txt>
        <Txt variant="body" style={{ marginTop: 4, marginBottom: Spacing.lg }}>
          Fill out the form and we will get back to you shortly.
        </Txt>
        <View style={styles.fields}>
          <Field icon="person-outline" placeholder="Your name" value={name} onChangeText={setName} />
          <Field
            icon="mail-outline"
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Field icon="business-outline" placeholder="Company name" value={companyName} onChangeText={setCompanyName} />
          <SelectField icon="briefcase-outline" placeholder="Service needed" />
          <Field icon="chatbox-outline" placeholder="Message (optional)" value={message} onChangeText={setMessage} multiline />
        </View>
        <Button label="Submit Inquiry" trailingIcon="arrow-forward" onPress={() => router.push('/login')} style={styles.submit} />
      </GlassCard>

      {/* Office */}
      <GlassCard style={styles.office} padded={false}>
        <Skyline height={120} opacity={0.25} />
        <View style={styles.officeInner}>
          <View style={styles.officeIcon}>
            <Ionicons name="location" size={20} color={Colors.cyan} />
          </View>
          <View style={styles.flex}>
            <Txt variant="title">Our Office</Txt>
            <Txt variant="bodyStrong" style={{ marginTop: 4 }}>
              {company.address.city}
            </Txt>
            <Txt variant="caption" style={{ color: Colors.textSecondary, marginTop: 2 }}>
              {company.address.line}
            </Txt>
          </View>
        </View>
      </GlassCard>

      {/* Trust footer */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="shield-checkmark" size={15} color={Colors.cyan} />
          <Txt variant="caption" style={{ color: Colors.textSecondary }}>
            Driven by integrity
          </Txt>
        </View>
        <View style={styles.footerDivider} />
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={15} color={Colors.cyan} />
          <Txt variant="caption" style={{ color: Colors.cyan }}>
            Response within 24 hours
          </Txt>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxxl },
  flex: { flex: 1 },
  underline: { width: 48, height: 3, borderRadius: 3, backgroundColor: Colors.cyan, marginTop: Spacing.md, marginBottom: Spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  contactCard: {},
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  instagram: { marginTop: Spacing.md },
  form: { marginTop: Spacing.lg },
  fields: { gap: Spacing.md },
  submit: { marginTop: Spacing.lg },
  office: { marginTop: Spacing.lg, overflow: 'hidden' },
  officeInner: { flexDirection: 'row', gap: Spacing.md, padding: Spacing.lg },
  officeIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(43,210,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.glass,
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerDivider: { width: StyleSheet.hairlineWidth, height: 18, backgroundColor: Colors.border },
});
