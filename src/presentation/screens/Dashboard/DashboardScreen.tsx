import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { formatCurrency } from '../../../utils/format';

export const DashboardScreen: React.FC = () => {
  const { balance } = useHomeViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total Balance</Text>
        <Text style={styles.statValue}>{formatCurrency(balance)}</Text>
      </View>
      <Image source={require('../../../../contents/figma/bytebank-figma/Gráfico pizza.png')} style={styles.chart} />
      <Text style={styles.caption}>Spending breakdown (sample)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  statCard: { backgroundColor: '#111827', padding: 16, borderRadius: 12, marginBottom: 16 },
  statLabel: { color: '#9CA3AF' },
  statValue: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 6 },
  chart: { width: '100%', height: 200, resizeMode: 'contain' },
  caption: { color: '#6b7280', textAlign: 'center', marginTop: 8 }
});

