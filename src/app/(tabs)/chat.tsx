import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/theme';
import { Screen, ScreenTitle, AnimatedIn, GlassCard, Button, Txt } from '@/components';
import { chatThreads } from '@/data/mock';

export default function ChatList() {
  const router = useRouter();

  return (
    <Screen contentStyle={styles.content}>
      <ScreenTitle title="Messages" subtitle="Your advisory conversations" avatar />

      <AnimatedIn index={0}>
        <Button
          label="Start New Inquiry"
          icon="add-circle-outline"
          onPress={() => router.push('/login')}
          style={styles.newBtn}
        />
      </AnimatedIn>

      {chatThreads.map((t, i) => (
        <AnimatedIn key={t.id} index={i + 1}>
          <GlassCard
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: t.id } })}
            style={styles.thread}
          >
            <View style={styles.threadRow}>
              <View style={styles.avatar}>
                <Ionicons name="headset-outline" size={20} color={Colors.cyan} />
                {t.online && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.flex}>
                <View style={styles.threadTop}>
                  <Txt variant="bodyStrong" numberOfLines={1} style={styles.flex}>
                    {t.name}
                  </Txt>
                  <Txt variant="caption" style={{ color: Colors.textMuted }}>
                    {t.time}
                  </Txt>
                </View>
                <View style={styles.threadBottom}>
                  <Txt variant="caption" style={styles.preview} numberOfLines={1}>
                    {t.preview}
                  </Txt>
                  {t.unread > 0 && (
                    <View style={styles.badge}>
                      <Txt variant="caption" style={styles.badgeText}>
                        {t.unread}
                      </Txt>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </GlassCard>
        </AnimatedIn>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  flex: { flex: 1 },
  newBtn: { marginBottom: Spacing.xl },
  thread: { marginBottom: Spacing.md },
  threadRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(43,210,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.available,
    borderWidth: 2,
    borderColor: Colors.bgRaised,
  },
  threadTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  threadBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm, marginTop: 3 },
  preview: { flex: 1, color: Colors.textSecondary },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: Colors.bg, fontWeight: '800', fontSize: 11 },
});
