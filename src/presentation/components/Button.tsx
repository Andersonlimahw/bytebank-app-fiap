import React, { useRef } from 'react';
import { Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle, Animated, Pressable, ActivityIndicator, View } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
};

export const Button: React.FC<Props> = ({ title, onPress, style, textStyle, disabled, loading }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20, bounciness: 0 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: disabled || loading ? 0.8 : 1 }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed, style]}
        accessibilityRole="button"
        accessibilityLabel={title}
        hitSlop={8}
      >
        <View style={styles.innerRow}>
          {loading ? <ActivityIndicator color={theme.colors.cardText} style={{ marginRight: 8 }} /> : null}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  btnPressed: { transform: [{ scale: 0.98 }] as any },
  innerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  text: { color: theme.colors.cardText, fontWeight: '600', textAlign: 'center' }
});
