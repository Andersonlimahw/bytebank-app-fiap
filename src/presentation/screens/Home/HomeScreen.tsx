import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { TransactionItem } from '../../components/TransactionItem';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { formatCurrency } from '../../../utils/format';

export const HomeScreen: React.FC = () => {
  const { loading, transactions, balance, refresh } = useHomeViewModel();
  const { user, signOut } = useAuthViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Hello,</Text>
          <Text style={styles.username}>{user?.name || 'User'}</Text>
        </View>
        <Image source={require('../../../../contents/figma/bytebank-figma/Avatar.png')} style={styles.avatar} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current balance</Text>
        <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
        <Text onPress={signOut} style={styles.signOut}>Sign out</Text>
      </View>

      <Text style={styles.sectionTitle}>Recent transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem tx={item} />}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  hello: { color: '#6b7280' },
  username: { fontSize: 20, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  card: { backgroundColor: '#111827', padding: 16, borderRadius: 12, marginBottom: 16 },
  cardLabel: { color: '#9CA3AF' },
  cardValue: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 },
  signOut: { color: '#A78BFA', marginTop: 8 },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 }
});
