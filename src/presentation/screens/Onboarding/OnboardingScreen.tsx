import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Button } from '../../components/Button';

const { width } = Dimensions.get('window');

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image: any;
};

export const OnboardingScreen: React.FC<any> = ({ navigation }) => {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: 'secure-banking',
        title: 'All-in-one digital banking',
        subtitle: 'Track balance, send money, and manage cards in one place.',
        image: require('../../../../contents/figma/bytebank-figma/Banner1.png'),
      },
      {
        key: 'insights',
        title: 'Clear insights at a glance',
        subtitle: 'Understand your spending with beautiful, easy charts.',
        image: require('../../../../contents/figma/bytebank-figma/Gráfico pizza.png'),
      },
      {
        key: 'login',
        title: 'Sign in your way',
        subtitle: 'Google, Apple, email, or just try it anonymously.',
        image: require('../../../../contents/figma/bytebank-figma/Ilustração Login.png'),
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / width);
    if (i !== index) setIndex(i);
  };

  const goNext = () => {
    const next = Math.min(index + 1, slides.length - 1);
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
  };

  const finish = () => {
    // Replace to avoid going back to onboarding
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((s) => (
          <View key={s.key} style={[styles.slide, { width }]}>
            <Image source={s.image} style={styles.image} />
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.subtitle}>{s.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />)
          )}
        </View>
        <View style={styles.actions}>
          {index < slides.length - 1 ? (
            <>
              <Button title="Skip" onPress={finish} />
              <View style={{ width: 12 }} />
              <Button title="Next" onPress={goNext} />
            </>
          ) : (
            <Button title="Get Started" onPress={finish} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: { flex: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  image: { width: width * 0.8, height: width * 0.8, resizeMode: 'contain', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 8 },
  footer: { padding: 16 },
  dots: { flexDirection: 'row', alignSelf: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e5e7eb', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#111827' },
  actions: { flexDirection: 'row', justifyContent: 'center' },
});

