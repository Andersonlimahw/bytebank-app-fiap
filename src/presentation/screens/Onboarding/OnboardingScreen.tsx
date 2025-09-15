import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, Image, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { Button } from '../../components/Button';
import { useFadeSlideInOnFocus } from '../../hooks/animations';
import { goToLogin } from '../../navigation/navigationUtils';
import { onboardingStyles as styles } from './OnboardingScreen.styles';

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
        image: require('../../../../contents/figma/home/Banner1-7.png'),
      },
      {
        key: 'insights',
        title: 'Clear insights at a glance',
        subtitle: 'Understand your spending with beautiful, easy charts.',
        image: require('../../../../public/assets/images/icons/Gráfico pizza.png'),
      },
      {
        key: 'login',
        title: 'Sign in your way',
        subtitle: 'Google, Apple, email, or just try it anonymously.',
        image: require('../../../../contents/figma/login/Ilustração-1.png'),
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const { animatedStyle } = useFadeSlideInOnFocus();
  const dotScales = useRef(slides.map(() => new Animated.Value(0))).current; // 0: inactive, 1: active

  useEffect(() => {
    dotScales.forEach((v, i) => {
      Animated.spring(v, {
        toValue: i === index ? 1 : 0,
        useNativeDriver: true,
        speed: 16,
        bounciness: 6,
      }).start();
    });
  }, [index, dotScales]);

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
    // Usa reset para evitar voltar ao onboarding; funciona em Stack/Tab
    goToLogin(navigation);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle as any]}>
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
            <Animated.View
              key={i}
              style={[
                styles.dot,
                i === index ? styles.dotActive : null,
                { transform: [{ scale: dotScales[i].interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }] },
              ]}
            />
          ))}
        </View>
        <View style={styles.actions}>
          {index < slides.length - 1 ? (
            <>
              <Button title="Skip" onPress={finish} />
              <View style={styles.spacer} />
              <Button title="Next" onPress={goNext} />
            </>
          ) : (
            <Button title="Get Started" onPress={finish} />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// styles moved to OnboardingScreen.styles.ts
