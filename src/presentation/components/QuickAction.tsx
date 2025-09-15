import React, { useRef } from 'react';
import { Image, Text, StyleSheet, ViewStyle, ImageSourcePropType, Animated, Pressable, Vibration } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  label: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  style?: ViewStyle;
};

export const QuickAction: React.FC<Props> = ({ label, icon, onPress, style }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 24, bounciness: 0 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 6 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onLongPress={() => Vibration.vibrate(15)}
        style={({ pressed }) => [styles.container, pressed && styles.containerPressed, style]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Image source={icon} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 88,
    height: 88,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  containerPressed: { opacity: 0.95 },
  icon: { width: 28, height: 28, resizeMode: 'contain', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '600', textAlign: 'center', color: theme.colors.text },
});
