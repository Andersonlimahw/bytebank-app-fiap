import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef } from 'react';
import { Image, Text, Animated, Pressable, Vibration } from 'react-native';
import { useTheme } from '../theme/theme';
import { makeQuickActionStyles } from './QuickAction.styles';
export const QuickAction = ({ label, icon, onPress, style }) => {
    const theme = useTheme();
    const styles = useMemo(() => makeQuickActionStyles(theme), [theme]);
    const scale = useRef(new Animated.Value(1)).current;
    const pressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 24, bounciness: 0 }).start();
    const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 6 }).start();
    return (_jsx(Animated.View, { style: { transform: [{ scale }] }, children: _jsxs(Pressable, { onPress: onPress, onPressIn: pressIn, onPressOut: pressOut, onLongPress: () => Vibration.vibrate(15), style: ({ pressed }) => [styles.container, pressed && styles.containerPressed, style], accessibilityRole: "button", accessibilityLabel: label, children: [_jsx(Image, { source: icon, style: styles.icon }), _jsx(Text, { style: styles.label, children: label })] }) }));
};
