import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, ScreenTitle, AnimatedIn, ServiceCard } from '@/components';
import { services } from '@/data/mock';

export default function Services() {
  const router = useRouter();

  return (
    <Screen contentStyle={styles.content}>
      <ScreenTitle title="Our Services" subtitle="End-to-end financial solutions for businesses and investors." avatar />

      {services.map((s, i) => (
        <AnimatedIn key={s.id} index={i}>
          <ServiceCard
            service={s}
            onPress={() => router.push({ pathname: '/service/[id]', params: { id: s.id } })}
          />
        </AnimatedIn>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
});
