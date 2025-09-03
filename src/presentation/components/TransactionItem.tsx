import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Transaction } from '../../domain/entities/Transaction';
import { formatCurrency, formatDateShort } from '../../utils/format';

export const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const sign = tx.type === 'credit' ? '+' : '-';
  const color = tx.type === 'credit' ? '#16a34a' : '#dc2626';
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
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#eee' },
  title: { fontWeight: '600', fontSize: 16 },
  date: { color: '#6b7280', marginTop: 2 },
  amount: { fontWeight: '700' }
});

