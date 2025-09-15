import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, View, Text, Pressable } from 'react-native';
import { theme } from '../theme/theme';
import { swipeableRowStyles as styles } from './SwipeableRow.styles';

type Props = {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  rightWidth?: number; // total width of actions
};

export const SwipeableRow: React.FC<Props> = ({ children, onEdit, onDelete, rightWidth = 160 }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);

  const clamp = (v: number) => Math.min(0, Math.max(-rightWidth, v));

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 6,
        onPanResponderMove: (_, g) => {
          const next = clamp((open ? -rightWidth : 0) + g.dx);
          translateX.setValue(next);
        },
        onPanResponderRelease: (_, g) => {
          const shouldOpen = g.vx < -0.1 || (open ? g.dx < 40 : g.dx < -rightWidth / 3);
          Animated.spring(translateX, {
            toValue: shouldOpen ? -rightWidth : 0,
            useNativeDriver: true,
            speed: 18,
            bounciness: 6,
          }).start(() => setOpen(shouldOpen));
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateX, { toValue: open ? -rightWidth : 0, useNativeDriver: true, speed: 18, bounciness: 6 }).start();
        },
      }),
    [open, rightWidth, translateX]
  );

  const close = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 6 }).start(() => setOpen(false));
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.actions, { width: rightWidth }]}>        
        {onEdit ? (
          <Pressable style={[styles.actionBtn, { backgroundColor: theme.colors.accent }]} onPress={() => { close(); onEdit?.(); }} accessibilityRole="button" accessibilityLabel="Editar">
            <Text style={styles.actionText}>Editar</Text>
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable style={[styles.actionBtn, { backgroundColor: theme.colors.danger }]} onPress={() => { close(); onDelete?.(); }} accessibilityRole="button" accessibilityLabel="Excluir">
            <Text style={styles.actionText}>Excluir</Text>
          </Pressable>
        ) : null}
      </View>
      <Animated.View style={{ transform: [{ translateX }] }} {...pan.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
};

/** styles moved to SwipeableRow.styles.ts */
