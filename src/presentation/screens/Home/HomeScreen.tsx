import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView } from 'react-native';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { TransactionItem } from '../../components/TransactionItem';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { formatCurrency } from '../../../utils/format';
import { QuickAction } from '../../components/QuickAction';

export const HomeScreen: React.FC = () => {
  const { loading, transactions, balance, refresh } = useHomeViewModel();
  const { user, signOut } = useAuthViewModel();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.username}>{user?.name || 'Usuário'}</Text>
        </View>
        <Image source={require('../../../../contents/figma/icons/Avatar.png')} style={styles.avatar} />
      </View>

      <Image source={require('../../../../contents/figma/home/Banner1-4.png')} style={styles.banner} />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saldo atual</Text>
        <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
        <Text onPress={signOut} style={styles.signOut}>Sair</Text>
      </View>

      <Text style={styles.sectionTitle}>Atalhos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
        <QuickAction label="Pix" icon={require('../../../../contents/figma/icons/Ícone Pix.png')} />
        <QuickAction label="Cartões" icon={require('../../../../contents/figma/icons/Ícone cartões.png')} style={styles.actionGap} />
        <QuickAction label="Empréstimo" icon={require('../../../../contents/figma/icons/Ícone empréstimo.png')} style={styles.actionGap} />
        <QuickAction label="Saque" icon={require('../../../../contents/figma/icons/Ícone Saque.png')} style={styles.actionGap} />
        <QuickAction label="Seguros" icon={require('../../../../contents/figma/icons/Ícone seguros.png')} style={styles.actionGap} />
        <QuickAction label="Doações" icon={require('../../../../contents/figma/icons/Ícone doações.png')} style={styles.actionGap} />
      </ScrollView>

      <Text style={styles.sectionTitle}>Transações recentes</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem tx={item} />}
        refreshing={loading}
        onRefresh={refresh}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  hello: { color: '#6b7280' },
  username: { fontSize: 20, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  banner: { width: '100%', height: 120, resizeMode: 'cover', borderRadius: 12, marginBottom: 16 },
  card: { backgroundColor: '#111827', padding: 16, borderRadius: 12, marginBottom: 16 },
  cardLabel: { color: '#9CA3AF' },
  cardValue: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 },
  signOut: { color: '#A78BFA', marginTop: 8 },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  actionsRow: { paddingVertical: 4 },
  actionGap: { marginLeft: 12 },
});
