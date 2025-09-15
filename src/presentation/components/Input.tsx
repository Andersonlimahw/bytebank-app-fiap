import React, { useEffect, useRef, useState } from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text, StyleProp, TextStyle, Animated, Pressable } from 'react-native';
import { theme } from '../theme/theme';

type Props = TextInputProps & {
  label?: string;
  errorText?: string | null;
  showPasswordToggle?: boolean;
};

export const Input: React.FC<Props> = ({ label, errorText, style, onFocus, onBlur, showPasswordToggle, secureTextEntry, ...rest }) => {
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
    if (!errorText) return;
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

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text> : null}
      <Animated.View
        style={{
          transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-4, 4] }) }],
        }}
      >
        <Animated.View style={[styles.input, { borderColor, backgroundColor: bgColor }, errorText ? styles.inputError : undefined, style as StyleProp<TextStyle>] as any}>
          <TextInput
            style={styles.inputInner}
            placeholderTextColor={theme.colors.muted}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            secureTextEntry={showPasswordToggle ? hide : secureTextEntry}
            {...rest}
          />
          {showPasswordToggle && secureTextEntry ? (
            <Pressable onPress={() => setHide((v) => !v)} hitSlop={8} accessibilityRole="button" accessibilityLabel={hide ? 'Mostrar senha' : 'Ocultar senha'}>
              <Text style={styles.toggle}>{hide ? 'Mostrar' : 'Ocultar'}</Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </Animated.View>
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: theme.spacing.sm },
  label: { color: theme.colors.muted, marginBottom: theme.spacing.xs },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputInner: {
    paddingVertical: 8,
    color: theme.colors.text,
    flex: 1,
  },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, marginTop: theme.spacing.xs },
  labelFocused: { color: theme.colors.primary },
  toggle: { color: theme.colors.primary, fontWeight: '600', paddingHorizontal: 4, paddingVertical: 6 },
});
