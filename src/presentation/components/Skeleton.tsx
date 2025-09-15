import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  width?: number | `${number}%` | 'auto';
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export const Skeleton: React.FC<Props> = ({ width = '100%' as `${number}%`, height = 16, radius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          // casting to any to satisfy Animated style width typing for percentage values
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: theme.colors.surface,
          opacity,
        } as any,
        style,
      ]}
    />
  );
};
