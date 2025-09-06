import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { formatCurrency } from '../../../utils/format';
import { QuickAction } from '../../components/QuickAction';
import { TransactionItem } from '../../components/TransactionItem';
import { useDashboardViewModel } from '../../viewmodels/useDashboardViewModel';

export const DashboardScreen: React.FC = () => {
  const { user, balance, transactions, loading, refresh, addDemoCredit, addDemoDebit } = useDashboardViewModel();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá,</Text>
          <Text style={styles.username}>{user?.name || 'Usuário'}</Text>
        </View>
        <Image source={require('../../../../contents/figma/icons/Avatar.png')} style={styles.avatar} />
      </View>

      <Image source={require('../../../../contents/figma/dashboard/Mobile _ Inicial.png')} style={styles.banner} />

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saldo total</Text>
        <Text style={styles.cardValue}>{formatCurrency(balance)}</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={addDemoCredit} style={[styles.smallBtn, { backgroundColor: '#16a34a' }]}
            accessibilityRole="button" accessibilityLabel="Adicionar crédito demo">
            <Text style={styles.smallBtnText}>+ Crédito demo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addDemoDebit} style={[styles.smallBtn, { backgroundColor: '#dc2626', marginLeft: 8 }]}
            accessibilityRole="button" accessibilityLabel="Adicionar débito demo">
            <Text style={styles.smallBtnText}>- Débito demo</Text>
          </TouchableOpacity>
        </View>
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

      <Text style={styles.sectionTitle}>Meus cartões</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
        <Image source={require('../../../../contents/figma/dashboard/cards/Cartão Byte digital.png')} style={styles.cardImage} />
        <Image source={require('../../../../contents/figma/dashboard/cards/Cartão Byte Físico.png')} style={[styles.cardImage, { marginLeft: 12 }]} />
      </ScrollView>

      <Text style={styles.sectionTitle}>Resumo de gastos</Text>
      <Image source={require('../../../../contents/figma/icons/Gráfico pizza.png')} style={styles.chart} />
      <Text style={styles.caption}>Distribuição por categoria (exemplo)</Text>

      <Text style={styles.sectionTitle}>Últimas transações</Text>
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
  cardValue: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  smallBtn: { borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  smallBtnText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8, marginTop: 4 },
  actionsRow: { paddingVertical: 4 },
  actionGap: { marginLeft: 12 },
  cardImage: { width: 260, height: 160, resizeMode: 'contain' },
  chart: { width: '100%', height: 200, resizeMode: 'contain' },
  caption: { color: '#6b7280', textAlign: 'center', marginTop: 8 }
});
