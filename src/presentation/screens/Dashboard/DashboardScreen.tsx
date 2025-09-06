import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity, Animated } from 'react-native';
import { formatCurrency } from '../../../utils/format';
import { QuickAction } from '../../components/QuickAction';
import { TransactionItem } from '../../components/TransactionItem';
import { useDashboardViewModel } from '../../viewmodels/useDashboardViewModel';
import { theme } from '../../theme/theme';
import { useFadeSlideInOnFocus, useChartEntranceAndPulse } from '../../hooks/animations';

export const DashboardScreen: React.FC = () => {
  const { user, balance, transactions, loading, refresh, addDemoCredit, addDemoDebit } = useDashboardViewModel();
  const { animatedStyle } = useFadeSlideInOnFocus();
  const { animatedStyle: chartStyle } = useChartEntranceAndPulse(transactions?.length ?? 0);

  return (
    <Animated.ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={animatedStyle as any}>
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
          <TouchableOpacity onPress={addDemoCredit} style={[styles.smallBtn, { backgroundColor: theme.colors.success }]}
            accessibilityRole="button" accessibilityLabel="Adicionar crédito demo">
            <Text style={styles.smallBtnText}>+ Crédito demo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addDemoDebit} style={[styles.smallBtn, { backgroundColor: theme.colors.danger, marginLeft: theme.spacing.sm }]}
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
      <Animated.Image source={require('../../../../contents/figma/icons/Gráfico pizza.png')} style={[styles.chart, chartStyle as any]} />
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
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  hello: { color: theme.colors.muted },
  username: { fontSize: theme.text.h2, fontWeight: '700', color: theme.colors.text },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  banner: { width: '100%', height: 120, resizeMode: 'cover', borderRadius: theme.radius.md, marginBottom: theme.spacing.lg },
  card: { backgroundColor: theme.colors.card, padding: theme.spacing.lg, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg },
  cardLabel: { color: '#9CA3AF' },
  cardValue: { color: theme.colors.cardText, fontSize: 28, fontWeight: '800', marginTop: 6, marginBottom: theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  smallBtn: { borderRadius: theme.radius.sm, paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
  smallBtnText: { color: theme.colors.cardText, fontWeight: '700' },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: theme.spacing.sm, marginTop: theme.spacing.xs, color: theme.colors.text },
  actionsRow: { paddingVertical: theme.spacing.sm },
  actionGap: { marginLeft: theme.spacing.md },
  cardImage: { width: 260, height: 160, resizeMode: 'contain' },
  chart: { width: '100%', height: 200, resizeMode: 'contain' },
  caption: { color: theme.colors.muted, textAlign: 'center', marginTop: theme.spacing.sm }
});
