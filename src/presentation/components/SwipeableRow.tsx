import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, View, Pressable, LayoutChangeEvent } from 'react-native';
import { theme } from '../theme/theme';
import { swipeableRowStyles as styles } from './SwipeableRow.styles';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  rightWidth?: number; // total width of actions
};

export const SwipeableRow: React.FC<Props> = ({ children, onEdit, onDelete, rightWidth = 160 }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);
  const [rowWidth, setRowWidth] = useState(0);

  useEffect(() => {
    const id = translateX.addListener(() => {});
    return () => translateX.removeListener(id);
  }, [translateX]);

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
          const eff = clamp((open ? -rightWidth : 0) + g.dx);
          const shouldOpen = g.vx < -0.1 || (open ? g.dx < 40 : g.dx < -rightWidth / 3);
          const deleteThreshold = Math.max(120, rowWidth * 0.6);
          const willDelete = !!onDelete && -eff > deleteThreshold;

          if (willDelete) {
            Animated.timing(translateX, { toValue: -rowWidth, duration: 160, useNativeDriver: true }).start(() => {
              setOpen(false);
              onDelete?.();
              translateX.setValue(0);
            });
            return;
          }

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
    [open, rightWidth, translateX, rowWidth, onDelete]
  );

  const close = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 6 }).start(() => setOpen(false));
  };

  const onLayout = (e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      <View style={[styles.actions, { width: rightWidth }]}>        
        {onEdit ? (
          <Pressable
            style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]}
            onPress={() => {
              close();
              onEdit?.();
            }}
            accessibilityRole="button"
            accessibilityLabel="Editar"
          >
            <Ionicons name="pencil" size={22} color={theme.colors.text} />
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable
            style={[styles.actionBtn, { backgroundColor: theme.colors.danger }]}
            onPress={() => {
              close();
              onDelete?.();
            }}
            accessibilityRole="button"
            accessibilityLabel="Excluir"
          >
            <Ionicons name="trash" size={22} color={theme.colors.cardText} />
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

