import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef } from 'react';
import { Text, Animated, Pressable, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../theme/theme';
import { makeButtonStyles } from './Button.styles';
export const Button = ({ title, onPress, style, textStyle, disabled, loading }) => {
    const theme = useTheme();
    const styles = useMemo(() => makeButtonStyles(theme), [theme]);
    const scale = useRef(new Animated.Value(1)).current;
    const pressIn = () => {
        Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20, bounciness: 0 }).start();
    };
    const pressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
    };
    return (_jsx(Animated.View, { style: { transform: [{ scale }], opacity: disabled || loading ? 0.8 : 1 }, children: _jsx(Pressable, { onPress: onPress, onPressIn: pressIn, onPressOut: pressOut, disabled: disabled || loading, style: ({ pressed }) => [styles.btn, pressed && styles.btnPressed, style], accessibilityRole: "button", accessibilityLabel: title, hitSlop: 8, children: _jsxs(View, { style: styles.innerRow, children: [loading ? _jsx(ActivityIndicator, { color: theme.colors.cardText, style: styles.activityIndicator }) : null, _jsx(Text, { style: [styles.text, textStyle], children: title })] }) }) }));
};
