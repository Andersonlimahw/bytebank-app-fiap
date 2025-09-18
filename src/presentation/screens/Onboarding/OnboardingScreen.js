import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, Image, Animated } from 'react-native';
import { Button } from '../../components/Button';
import { useFadeSlideInOnFocus } from '../../hooks/animations';
import { goToLogin } from '../../navigation/navigationUtils';
import { useTheme } from '../../theme/theme';
import { makeOnboardingStyles } from './OnboardingScreen.styles';
import { useI18n } from '../../i18n/I18nProvider';
const { width } = Dimensions.get('window');
export const OnboardingScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = useMemo(() => makeOnboardingStyles(theme), [theme]);
    const { t } = useI18n();
    const slides = useMemo(() => [
        {
            key: 'secure-banking',
            title: t('onboarding.slides.secureBanking.title'),
            subtitle: t('onboarding.slides.secureBanking.subtitle'),
            image: require('../../../../contents/figma/home/Banner1-7.png'),
        },
        {
            key: 'insights',
            title: t('onboarding.slides.insights.title'),
            subtitle: t('onboarding.slides.insights.subtitle'),
            image: require('../../../../public/assets/images/icons/Gráfico pizza.png'),
        },
        {
            key: 'login',
            title: t('onboarding.slides.login.title'),
            subtitle: t('onboarding.slides.login.subtitle'),
            image: require('../../../../contents/figma/login/Ilustração-1.png'),
        },
    ], [t]);
    const [index, setIndex] = useState(0);
    const scrollRef = useRef(null);
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
    const onScroll = (e) => {
        const x = e.nativeEvent.contentOffset.x;
        const i = Math.round(x / width);
        if (i !== index)
            setIndex(i);
    };
    const goNext = () => {
        const next = Math.min(index + 1, slides.length - 1);
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
    };
    const finish = () => {
        // Usa reset para evitar voltar ao onboarding; funciona em Stack/Tab
        goToLogin(navigation);
    };
    return (_jsxs(Animated.View, { style: [styles.container, animatedStyle], children: [_jsx(ScrollView, { ref: scrollRef, horizontal: true, pagingEnabled: true, showsHorizontalScrollIndicator: false, onScroll: onScroll, scrollEventThrottle: 16, children: slides.map((s) => (_jsxs(View, { style: [styles.slide, { width }], children: [_jsx(Image, { source: s.image, style: styles.image }), _jsx(Text, { style: styles.title, children: s.title }), _jsx(Text, { style: styles.subtitle, children: s.subtitle })] }, s.key))) }), _jsxs(View, { style: styles.footer, children: [_jsx(View, { style: styles.dots, children: slides.map((_, i) => (_jsx(Animated.View, { style: [
                                styles.dot,
                                i === index ? styles.dotActive : null,
                                { transform: [{ scale: dotScales[i].interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }] },
                            ] }, i))) }), _jsx(View, { style: styles.actions, children: index < slides.length - 1 ? (_jsxs(_Fragment, { children: [_jsx(Button, { title: t('onboarding.skip'), onPress: finish }), _jsx(View, { style: styles.spacer }), _jsx(Button, { title: t('onboarding.next'), onPress: goNext })] })) : (_jsx(Button, { title: t('onboarding.getStarted'), onPress: finish })) })] })] }));
};
