import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Transaction } from '../../domain/entities/Transaction';
import { formatCurrency, formatDateShort } from '../../utils/format';
import { theme } from '../theme/theme';

type Props = { tx: Transaction; onPress?: () => void };

export const TransactionItem: React.FC<Props> = ({ tx, onPress }) => {
  const sign = tx.type === 'credit' ? '+' : '-';
  const color = tx.type === 'credit' ? theme.colors.success : theme.colors.danger;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} style={styles.row}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `Abrir opções para ${tx.description}` : undefined}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{tx.description}</Text>
        <Text style={styles.date}>{formatDateShort(new Date(tx.createdAt))}</Text>
        {!!tx.category && <Text style={styles.category}>{tx.category}</Text>}
      </View>
      <Text style={[styles.amount, { color }]}>
        {sign} {formatCurrency(tx.amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border },
  title: { fontWeight: '600', fontSize: 16 },
  date: { color: theme.colors.muted, marginTop: 2 },
  category: { color: theme.colors.accent, marginTop: 2, fontSize: 12 },
  amount: { fontWeight: '700' }
});
