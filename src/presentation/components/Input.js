import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View, Text, Animated, Pressable } from 'react-native';
import { useTheme } from '../theme/theme';
import { makeInputStyles } from './Input.styles';
import { useI18n } from '../i18n/I18nProvider';
export const Input = ({ label, errorText, style, onFocus, onBlur, showPasswordToggle, secureTextEntry, ...rest }) => {
    const theme = useTheme();
    const { t } = useI18n();
    const styles = useMemo(() => makeInputStyles(theme), [theme]);
    const [focused, setFocused] = useState(false);
    const focusAnim = useRef(new Animated.Value(0)).current; // 0: blur, 1: focus
    const shake = useRef(new Animated.Value(0)).current;
    const [hide, setHide] = useState(!!secureTextEntry);
    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: focused ? 1 : 0,
            duration: 160,
            useNativeDriver: false,
        }).start();
    }, [focused, focusAnim]);
    useEffect(() => {
        if (!errorText)
            return;
        shake.setValue(0);
        Animated.sequence([
            Animated.timing(shake, { toValue: 1, duration: 40, useNativeDriver: true }),
            Animated.timing(shake, { toValue: -1, duration: 70, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
    }, [errorText, shake]);
    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [errorText ? theme.colors.danger : theme.colors.border, theme.colors.primary],
    });
    const bgColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.background, theme.colors.surface],
    });
    return (_jsxs(View, { style: styles.wrapper, children: [label ? _jsx(Text, { style: [styles.label, focused && styles.labelFocused], children: label }) : null, _jsx(Animated.View, { style: {
                    transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-4, 4] }) }],
                }, children: _jsxs(Animated.View, { style: [styles.input, { borderColor, backgroundColor: bgColor }, errorText ? styles.inputError : undefined, style], children: [_jsx(TextInput, { style: styles.inputInner, placeholderTextColor: theme.colors.muted, onFocus: (e) => {
                                setFocused(true);
                                onFocus?.(e);
                            }, onBlur: (e) => {
                                setFocused(false);
                                onBlur?.(e);
                            }, secureTextEntry: showPasswordToggle ? hide : secureTextEntry, ...rest }), showPasswordToggle && secureTextEntry ? (_jsx(Pressable, { onPress: () => setHide((v) => !v), hitSlop: 8, accessibilityRole: "button", accessibilityLabel: hide ? t('auth.showPassword') : t('auth.hidePassword'), children: _jsx(Text, { style: styles.toggle, children: hide ? t('common.show') : t('common.hide') }) })) : null] }) }), !!errorText && _jsx(Text, { style: styles.error, children: errorText })] }));
};
