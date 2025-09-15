import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import type { Transaction } from '../../domain/entities/Transaction';
import { formatCurrency, formatDateShort } from '../../utils/format';
import { theme } from '../theme/theme';
import { transactionItemStyles as styles } from './TransactionItem.styles';
import { SwipeableRow } from './SwipeableRow';

type Props = { tx: Transaction; onPress?: () => void; onEdit?: () => void; onDelete?: () => void };

export const TransactionItem: React.FC<Props> = ({ tx, onPress, onEdit, onDelete }) => {
  const sign = tx.type === 'credit' ? '+' : '-';
  const color = tx.type === 'credit' ? theme.colors.success : theme.colors.danger;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const content = (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `Abrir opções para ${tx.description}` : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{tx.description}</Text>
        <Text style={styles.date}>{formatDateShort(new Date(tx.createdAt))}</Text>
        {!!tx.category && <Text style={styles.category}>{tx.category}</Text>}
      </View>
      <Text style={[styles.amount, { color }]}>
        {sign} {formatCurrency(tx.amount)}
      </Text>
    </Pressable>
  );

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {onEdit || onDelete ? (
        <SwipeableRow onEdit={onEdit} onDelete={onDelete}>{content}</SwipeableRow>
      ) : (
        content
      )}
    </Animated.View>
  );
};

/** styles moved to TransactionItem.styles.ts */
