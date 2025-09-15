import React from 'react';
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, Animated } from 'react-native';
import { formatCurrency } from '../../../utils/format';
import { QuickAction } from '../../components/QuickAction';
import { TransactionItem } from '../../components/TransactionItem';
import { useDashboardViewModel } from '../../viewmodels/useDashboardViewModel';
import { theme } from '../../theme/theme';
import { dashboardStyles as styles } from './DashboardScreen.styles';
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
        <Image source={require('../../../../public/assets/images/icons/Avatar.png')} style={styles.avatar} />
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
        <QuickAction label="Pix" icon={require('../../../../public/assets/images/icons/Ícone Pix.png')} />
        <QuickAction label="Cartões" icon={require('../../../../public/assets/images/icons/Ícone cartões.png')} style={styles.actionGap} />
        <QuickAction label="Empréstimo" icon={require('../../../../public/assets/images/icons/Ícone empréstimo.png')} style={styles.actionGap} />
        <QuickAction label="Saque" icon={require('../../../../public/assets/images/icons/Ícone Saque.png')} style={styles.actionGap} />
        <QuickAction label="Seguros" icon={require('../../../../public/assets/images/icons/Ícone seguros.png')} style={styles.actionGap} />
        <QuickAction label="Doações" icon={require('../../../../public/assets/images/icons/Ícone doações.png')} style={styles.actionGap} />
      </ScrollView>

      <Text style={styles.sectionTitle}>Meus cartões</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
        <Image source={require('../../../../contents/figma/dashboard/cards/Cartão Byte digital.png')} style={styles.cardImage} />
        <Image source={require('../../../../contents/figma/dashboard/cards/Cartão Byte Físico.png')} style={[styles.cardImage, { marginLeft: 12 }]} />
      </ScrollView>

      <Text style={styles.sectionTitle}>Resumo de gastos</Text>
      <Animated.Image source={require('../../../../public/assets/images/icons/Gráfico pizza.png')} style={[styles.chart, chartStyle as any]} />
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

/** styles moved to DashboardScreen.styles.ts */
