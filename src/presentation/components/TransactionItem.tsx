import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Transaction } from '../../domain/entities/Transaction';
import { formatCurrency, formatDateShort } from '../../utils/format';
import { theme } from '../theme/theme';

export const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const sign = tx.type === 'credit' ? '+' : '-';
  const color = tx.type === 'credit' ? theme.colors.success : theme.colors.danger;
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{tx.description}</Text>
        <Text style={styles.date}>{formatDateShort(new Date(tx.createdAt))}</Text>
      </View>
      <Text style={[styles.amount, { color }]}>
        {sign} {formatCurrency(tx.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.border },
  title: { fontWeight: '600', fontSize: 16 },
  date: { color: theme.colors.muted, marginTop: 2 },
  amount: { fontWeight: '700' }
});
