import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../theme/theme';
import { makeSkeletonStyles } from './Skeleton.styles';
export const Skeleton = ({ width = '100%', height = 16, radius = 8, style }) => {
    const theme = useTheme();
    const styles = useMemo(() => makeSkeletonStyles(theme), [theme]);
    const opacity = useRef(new Animated.Value(0.6)).current;
    useEffect(() => {
        const loop = Animated.loop(Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        ]));
        loop.start();
        return () => loop.stop();
    }, [opacity]);
    return (_jsx(Animated.View, { style: [
            styles.base,
            {
                // casting to any to satisfy Animated style width typing for percentage values
                width: width,
                height,
                borderRadius: radius,
                opacity,
            },
            style,
        ] }));
};
